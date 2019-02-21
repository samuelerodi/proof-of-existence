App = {
  web3Provider: null,
  contracts: {},

  init: function() {
    return App.initWeb3();
  },

  initWeb3: function() {
    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider;
    } else {
      // If no injected web3 instance is detected, fall back to Ganache
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
    }
    web3 = new Web3(App.web3Provider);

    return App.initContract();
  },

  initContract: function() {
    $.getJSON('PoE.json', function(data) {
      var PoeArtifact = data;
      App.contracts.PoE = TruffleContract(PoeArtifact);
      App.contracts.PoE.setProvider(App.web3Provider);
      return App.initTable().then(function() {
        App.contracts.PoE.deployed().then(function(instance) {
          instance.hashAdded().watch(App.addEntryToTable);
        });
      });
    });

    return App.bindEvents();
  },

  bindEvents: function() {
    $(document).on('click', 'input#btn-upload', App.handleUpload);
    $(document).on('click', 'input#btn-verify', App.handleVerify);
  },

  initTable: function() {
    var poeInstance;
    return App.contracts.PoE.deployed().then(function(instance) {
      poeInstance = instance;
      return poeInstance.retrieveUserData.call();
    }).then(function(userFiles) {
      console.log(userFiles);
      for (var i = 0; i < userFiles.length; i++) {
        var newRow = $("<tr>");
        var col = "<td>" + userFiles[i] + "</td>";
        newRow.append(col);
        $("#referenceTable").append(newRow);
      }
    }).catch(function(err) {
      console.log(err.message);
    });
  },

  addEntryToTable: function(error, result) {
    //TODO: Add entry to table (Ref.ID (SHA256))
    if (error) {
      console.log("Error happened in EVENT: ", error);
      return;
    }
    var newHash = result.args.hash;
    var lastTableRow = $("#referenceTable tr td").last().html();
    if (lastTableRow !== newHash) {
      var newRow = $("<tr>");
      var col = "<td>" + newHash + "</td>";
      newRow.append(col);
      $("#referenceTable").append(newRow);
      console.log("Added new entry: ", newHash);
    }
  },

  handleUpload: function(event) {
    event.preventDefault();
    if (!window.File || !window.FileReader || !window.FileList || !window.Blob) {
      alert('The File APIs are not fully supported in this browser.');
      return;
    }
    input = document.getElementById('fileUpload');
    if (!input) {
      console.log("ERROR: Cannot find fileUpload field");
      return;
    }
    else if (!input.files) {
      console.log("ERROR: This browser doesn't seem to support the `files` property of file inputs.");
    }
    else if (!input.files[0]) {
      alert("Please select a file before clicking 'Upload'");
    }
    else {
      file = input.files[0];
      fr = new FileReader();
      fr.addEventListener("load", function () {
        var fileSHA256 = SHA256(fr.result);
        var poeInstance;

        web3.eth.getAccounts(function(error, accounts) {
          if (error) {
            console.log(error);
          }

          var account = accounts[0];

          App.contracts.PoE.deployed().then(function(instance) {
            poeInstance = instance;
            return poeInstance.sendFileHash("0x" + fileSHA256);

          }).catch(function(err) {
            console.log("ERROR: While sending file hash: ", err.message);
            alert("Could not send the transaction properly, you can check if your file is already uploaded with this Reference ID: 0x" + fileSHA256);
          });
        });
      }, false);
      fr.readAsBinaryString(file);
      return;
    }
  },

  handleVerify: function(event) {
    event.preventDefault();
    var poeInstance;
    var hash = $("#hashToVerify").val();
    return App.contracts.PoE.deployed().then(function(instance) {
      poeInstance = instance;
      return poeInstance.proveAuthenticity(hash);
    }).then(function(isPresent) {
      console.log("Is present? ", isPresent);
      alert("The file with Reference ID " + hash + " has" + (isPresent ? "" : " not") + " been found in the Smart Contract's state");
    }).catch(function(err) {
      alert("The hash can't be verified, please make sure there aren't typing error in the text field");
      console.log("ERROR: While proving authenticity: ", err.message);
    })
  }

};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
