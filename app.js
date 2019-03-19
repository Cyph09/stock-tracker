// Storage module

// Item module
const ItemController = (function() {
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
      //   {
      //     id: 0,
      //     name: "1200L Fridge",
      //     quantity: 23,
      //     unitCost: 540
      //   },
      //   {
      //     id: 2,
      //     name: "Maroon Leather sof",
      //     quantity: 6,
      //     unitCost: 380
      //   },
      //   {
      //     id: 3,
      //     name: "4P Dining Table",
      //     quantity: 4,
      //     unitCost: 217
      //   },
      //   {
      //     id: 4,
      //     name: "King size Bed",
      //     quantity: 14,
      //     unitCost: 512
      //   }
    ],
    currentItem: null,
    overallCost: 0
  };

  //   Public members
  return {
    getItems: function() {
      return data.items;
    },
    addItem: function(name, quantity, unitCost) {
      let ID;
      //   Create ID
      if (data.items.length > 0) {
        // ID = data.items[] + 1;
        ID = data.items[data.items.length - 1].id + 1;
      } else {
        ID = 0;
      }

      // Quantity and unitCost to numbers
      quantity = parseInt(quantity);
      unitCost = parseFloat(unitCost);

      //   Create new Item
      newItem = new Item(ID, name, quantity, unitCost);

      // Add to items array
      data.items.push(newItem);

      return newItem;
    },

    // Total items
    getTotalItems: function() {
      let total = 0;

      //   Loop through items and add quantity
      data.items.forEach(function(item) {
        total += item.quantity;
      });

      //   Set total items in data structure
      data.totalItems = total;

      //   Return total items

      return data.totalItems;
    },

    // Total cost
    getTotalCost: function() {
      let total = 0;

      //   Loop through items and add total cost of each iteme
      data.items.forEach(function(item) {
        total += item.quantity * item.unitCost;
      });

      //   Set total items in data structure
      data.totalCost = total;

      //   Return total items

      return data.totalCost;
    },

    logData: function() {
      return data;
    }
  };
})();

// UI Controller module
const UIController = (function() {
  // UI Selectors
  const UISelectors = {
    inventorySection: "#inventory-section",
    inventoryTBody: "#inventory-tbody",
    addBtn: ".add-btn",
    itemNameInput: "#item-name",
    itemQuantityInput: "#item-qty",
    itemUnitCostInput: "#item-cost",
    totalItems: ".total-items",
    totalCost: ".total-cost"
    // salesSection: "#sales-section",
    // salesTBody: "#sales-tbody"
  };
  // Public members
  return {
    populateInventoryTable: function(items) {
      // else populate the table
      let trHtml = "";
      items.forEach(item => {
        trHtml += `<tr id='item-${item.id}'>
          <td>${item.name}</td>
          <td>${item.quantity}</td>
          <td>$${item.unitCost}</td>
          <td>$${item.quantity * item.unitCost}</td>
          <td><a href="#"><i class="edit-item fas fa-pencil-alt"></i></a></td>
          </tr>`;
      });

      //   Inset items rows
      document.querySelector(UISelectors.inventoryTBody).innerHTML = trHtml;
    },

    // Get item inputs from ui
    getItemInput: function() {
      return {
        name: document.querySelector(UISelectors.itemNameInput).value,
        quantity: document.querySelector(UISelectors.itemQuantityInput).value,
        unitCost: document.querySelector(UISelectors.itemUnitCostInput).value
      };
    },

    // Add row item
    addRowItem: function(item) {
      // Show inventory list
      document.querySelector(UISelectors.inventorySection).style.display =
        "block";

      // create tr element
      const tr = document.createElement("tr");

      // Add ID
      tr.id = `item-${item.id}`;

      //   Add HTML
      tr.innerHTML = `<td>${item.name}</td>
        <td>${item.quantity}</td>
        <td>$${item.unitCost}</td>
        <td>$${item.quantity * item.unitCost}</td>
        <td><a href="#"><i class="edit-item fas fa-pencil-alt"></i></a></td>`;

      // Insert item
      document
        .querySelector(UISelectors.inventoryTBody)
        .insertAdjacentElement("beforeend", tr);
    },

    // Add/set total items
    showTotalItems: function(total) {
      document.querySelector(UISelectors.totalItems).textContent = total;
    },

    // Add/set total cost/grand total
    showTotalCost: function(total) {
      document.querySelector(UISelectors.totalCost).textContent = total;
    },

    clearInput: function() {
      document.querySelector(UISelectors.itemNameInput).value = "";
      document.querySelector(UISelectors.itemQuantityInput).value = "";
      document.querySelector(UISelectors.itemUnitCostInput).value = "";
      document.querySelector(UISelectors.itemNameInput).focus();
    },

    // Hide table/Inventory section
    hideInventorySecotion: function() {
      document.querySelector(UISelectors.inventorySection).style.display =
        "none";
    },
    // Get UI selectors
    getSelectors: function() {
      return UISelectors;
    }
  };
})();

// App module
const App = (function(ItemCtrl, UICtrl) {
  // Load event listeners
  const loadEventListeners = function() {
    //   GEt UI Selectors
    const UISelectors = UICtrl.getSelectors();

    // Add inventory item event
    document
      .querySelector(UISelectors.addBtn)
      .addEventListener("click", itemAddSubmit);
  };

  //   Get inventory total
  const setInventroyTotals = function() {
    //   get total items
    const totalItems = ItemCtrl.getTotalItems();

    //   Add total items to the UI
    UICtrl.showTotalItems(totalItems);

    //   get total cost(grand total)
    const totalCost = ItemCtrl.getTotalCost();

    //   Add total cost(grand total) to the UI
    UICtrl.showTotalCost(totalCost);
  };

  //   Add inventory item submit
  const itemAddSubmit = function(e) {
    // Get from input UI Controller
    const input = UICtrl.getItemInput();

    // Check for input values (name, qty and unit cost)
    if (input.name !== "" && input.quantity !== "" && input.unitCost !== "") {
      //   Add item
      const newItem = ItemCtrl.addItem(
        input.name,
        input.quantity,
        input.unitCost
      );

      //  Add items to the UI table row
      UICtrl.addRowItem(newItem);

      //   Set inventory total
      setInventroyTotals();

      //   Clear form fields
      UICtrl.clearInput();
    }

    e.preventDefault();
  };

  //   Public methods
  return {
    // initialize app
    init: function() {
      console.log("Initializing app...");

      //   Fetch items from data structure
      const items = ItemCtrl.getItems();
      //   check if any items whether to display section or not
      if (items.length === 0) {
        UICtrl.hideInventorySecotion();
      } else {
        //   populate UISelectors
        UICtrl.populateInventoryTable(items);
      }

      //   Set inventory totals
      setInventroyTotals();

      //   Load event listeners
      loadEventListeners();
    }
  };
})(ItemController, UIController);

// Start the app

App.init();
