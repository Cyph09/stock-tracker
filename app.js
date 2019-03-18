// Storage module

// Item module
const ItemModule = (function() {
  // private members

  // Item Constructor
  const Item = function(id, name, quantity, unitCost) {
    this.id = id;
    this.name = name;
    this.quantity = quantity;
    this.unitCost = unitCost;
  };

  // Data structure/state
  const data = {
    items: [
      {
        id: 0,
        name: "1200L Fridge",
        quantity: 23,
        unitCost: 540
      },
      {
        id: 2,
        name: "Maroon Leather sof",
        quantity: 6,
        unitCost: 380
      },
      {
        id: 3,
        name: "4P Dining Table",
        quantity: 4,
        unitCost: 217
      },
      {
        id: 4,
        name: "King size Bed",
        quantity: 14,
        unitCost: 512
      }
    ],
    currentItem: null,
    overallCost: 0
  };

  //   Public members
  return {
    getItems: function() {
      return data.items;
    },
    logData: function() {
      return data;
    }
  };
})();

// UISelectors module
const UIModule = (function() {
  // UI Selectors
  const UISelectors = {
    inventorySection: "#inventory-section",
    inventoryTBody: "#inventory-tbody"
    // salesSection: "#sales-section",
    // salesTBody: "#sales-tbody"
  };
  // Public members
  return {
    populateInventoryTable: function(items) {
      // if no items hide inventory table list
      if (items <= 0) {
        document.querySelector(UISelectors.inventorySection).style.display =
          "none";
      }
      // else populate the table
      let trHtml = "";
      items.forEach(item => {
        trHtml += `<tr id='${item.id}'>
          <td>${item.name}</td>
          <td>${item.quantity}</td>
          <td>$${item.unitCost}</td>
          <td>$${item.quantity * item.unitCost}</td>
          <td><a href="#"><i class="edit-item fas fa-pencil-alt"></i></a></td>
          </tr>`;
      });
      document.querySelector(UISelectors.inventoryTBody).innerHTML = trHtml;
    }
  };
})();

// App module
const App = (function(ItemModule, UIModule) {
  return {
    // initialize app
    init: function() {
      console.log("Initializing app...");

      //   Fetch items from data structure
      const items = ItemModule.getItems();

      //   log data
      console.log(items);

      //   populate UISelectors
      UIModule.populateInventoryTable(items);
    }
  };
})(ItemModule, UIModule);

// Start the app

App.init();
