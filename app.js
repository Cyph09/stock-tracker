// Storage module
const StorageController = (function() {
  // Public members

  return {
    storeItem: function(item) {
      let items;

      // check if any items in local storage
      if (localStorage.getItem("items") === null) {
        items = [];
        // Push new Item
        items.push(item);

        // Set local storage
        localStorage.setItem("items", JSON.stringify(items));
      } else {
        // Get items already in local storage
        items = JSON.parse(localStorage.getItem("items"));

        // Push new item
        items.push(item);

        // Re set local storage
        localStorage.setItem("items", JSON.stringify(items));
      }
    },

    getItemsFromStorage: function() {
      let items;
      if (localStorage.getItem("items") === null) {
        items = [];
      } else {
        items = JSON.parse(localStorage.getItem("items"));
      }

      return items;
    }
  };
})();

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
    // items: [
    //   {
    //     id: 0,
    //     name: "1200L Fridge",
    //     quantity: 23,
    //     unitCost: 540
    //   },
    //   {
    //     id: 2,
    //     name: "Maroon Leather sofa",
    //     quantity: 6,
    //     unitCost: 380
    //   },
    // ],
    items: StorageController.getItemsFromStorage(),
    currentItem: null,
    totalItems: 0,
    totalCost: 0
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

    // Get item by Id
    getItemById: function(id) {
      let found = null;

      // Loop through items
      data.items.forEach(function(item) {
        if (item.id === id) {
          found = item;
        }
      });

      return found;
    },

    // Update edited item
    updateItem: function(name, quantity, unitCost) {
      // Qunatity to number and unitCost to float
      quantity = parseInt(quantity);
      unitCost = parseFloat(unitCost);

      let found = null;
      // Loop through item to find the right item by its id
      data.items.forEach(function(item) {
        if (item.id === data.currentItem.id) {
          item.name = name;
          item.quantity = quantity;
          item.unitCost = unitCost;
          found = item;
        }
      });
      return found;
    },

    // Remove current Item
    deleteItem: function(id) {
      // Get Ids
      const ids = data.items.map(function(item) {
        return item.id;
      });

      // Get index
      const index = ids.indexOf(id);

      // Remove item
      data.items.splice(index, 1);
    },

    // Clear All items
    clearAllItems: function() {
      data.items = [];
      data.totalItems = 0;
      data.totalCost = 0;
    },

    // Set the current
    setCurrentItem: function(item) {
      data.currentItem = item;
    },

    // Get current item
    getCurrentItem: function() {
      return data.currentItem;
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
    tBodyRows: "#inventory-tbody tr",
    clearBtn: ".clear-btn",
    addBtn: ".add-btn",
    editBtn: ".edit-btn",
    deleteBtn: ".delete-btn",
    backBtn: ".back-btn",
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

    // Update item
    updateTRowItem: function(item) {
      let tBodyRows = document.querySelectorAll(UISelectors.tBodyRows);

      // Convert tBodyRows into an array
      tBodyRows = Array.from(tBodyRows);

      tBodyRows.forEach(function(tBodyRow) {
        const itemID = tBodyRow.getAttribute("id");

        if (itemID === `item-${item.id}`) {
          document.querySelector(`#${itemID}`).innerHTML = `<td>${
            item.name
          }</td>
          <td>${item.quantity}</td>
          <td>$${item.unitCost}</td>
          <td>$${item.quantity * item.unitCost}</td>
          <td><a href="#"><i class="edit-item fas fa-pencil-alt"></i></a></td>`;
        }
      });
    },

    deleteTRowItem: function(id) {
      const itemID = `#item-${id}`;
      const item = document.querySelector(itemID);

      let tBodyRows = document.querySelectorAll(UISelectors.tBodyRows);
      if (tBodyRows.length === 1) {
        item.remove();
        setTimeout(function() {
          UIController.hideInventorySecotion();
        }, 1 * 1000);
      } else {
        item.remove();
      }
    },
    // Remove all items from UI
    removeItems: function() {
      let tBodyRows = document.querySelectorAll(UISelectors.tBodyRows);
      // Convert tBodyRows into an array
      tBodyRows = Array.from(tBodyRows);

      tBodyRows.forEach(function(item) {
        item.remove();
      });
      setTimeout(function() {
        UIController.hideInventorySecotion();
      }, 1 * 1000);
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

    // Add item to form
    addItemToForm: function() {
      document.querySelector(
        UISelectors.itemNameInput
      ).value = ItemController.getCurrentItem().name;
      document.querySelector(
        UISelectors.itemQuantityInput
      ).value = ItemController.getCurrentItem().quantity;
      document.querySelector(
        UISelectors.itemUnitCostInput
      ).value = ItemController.getCurrentItem().unitCost;
    },

    // Hide table/Inventory section
    hideInventorySecotion: function() {
      document.querySelector(UISelectors.inventorySection).style.display =
        "none";
    },

    // Clear edit state
    clearEditState: function() {
      UIController.clearInput();
      document.querySelector(UISelectors.editBtn).style.display = "none";
      document.querySelector(UISelectors.deleteBtn).style.display = "none";
      document.querySelector(UISelectors.backBtn).style.display = "none";
      document.querySelector(UISelectors.addBtn).style.display = "inline";
    },

    // Show edit state
    showEditState: function() {
      document.querySelector(UISelectors.editBtn).style.display = "inline";
      document.querySelector(UISelectors.deleteBtn).style.display = "inline";
      document.querySelector(UISelectors.backBtn).style.display = "inline";
      document.querySelector(UISelectors.addBtn).style.display = "none";
    },
    // Get UI selectors
    getSelectors: function() {
      return UISelectors;
    }
  };
})();

// App module
const App = (function(ItemCtrl, StorageCtrl, UICtrl) {
  // Load event listeners
  const loadEventListeners = function() {
    //   GEt UI Selectors
    const UISelectors = UICtrl.getSelectors();

    // Add inventory item event
    document
      .querySelector(UISelectors.addBtn)
      .addEventListener("click", itemAddSubmit);

    // Disable submit on enter
    document.addEventListener("keypress", function(e) {
      if (e.keyCode === 13 || e.which === 13) {
        e.preventDefault();
        return false;
      }
    });

    // Back button click to clear edit state and return to add state
    document
      .querySelector(UISelectors.backBtn)
      .addEventListener("click", UICtrl.clearEditState);

    // Edit icon/btn click event
    document
      .querySelector(UISelectors.inventoryTBody)
      .addEventListener("click", itemEditClick);

    // Update button click
    document
      .querySelector(UISelectors.editBtn)
      .addEventListener("click", itemUpdateSubmit);

    // Delete button click
    document
      .querySelector(UISelectors.deleteBtn)
      .addEventListener("click", itemDeleteSubmit);

    // Clar All button click
    document
      .querySelector(UISelectors.clearBtn)
      .addEventListener("click", clearAllItemsSubmit);
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

      // Store in local storage
      StorageCtrl.storeItem(newItem);

      //   Clear form fields
      UICtrl.clearInput();
    }

    e.preventDefault();
  };

  // click edit inventory item
  const itemEditClick = function(e) {
    if (e.target.classList.contains("edit-item")) {
      // Get tabel row item id (item-0, item-1)
      const tRowId = e.target.parentNode.parentNode.parentNode.id;
      // Get the actual ID of the item
      const id = parseInt(tRowId.split("-")[1]);

      // Get item
      const itemToEdit = ItemCtrl.getItemById(id);

      // Set current item;
      ItemCtrl.setCurrentItem(itemToEdit);

      // Add current item to form for editing
      UICtrl.addItemToForm();

      // show edit state
      UICtrl.showEditState();
    }
    e.preventDefault();
  };

  // Update item submit
  const itemUpdateSubmit = function(e) {
    // Get input from UI
    const input = UICtrl.getItemInput();

    // update edited item in data structure
    const updatedItem = ItemCtrl.updateItem(
      input.name,
      input.quantity,
      input.unitCost
    );

    // update UI
    UICtrl.updateTRowItem(updatedItem);

    //   Update inventory totals
    setInventroyTotals();

    // Clear edit state
    UICtrl.clearEditState();

    e.preventDefault();
  };

  // Delete item submit
  const itemDeleteSubmit = function(e) {
    // Get current item
    const currentItem = ItemCtrl.getCurrentItem();

    // Delete from data structure
    ItemCtrl.deleteItem(currentItem.id);

    // Delete from UI
    UICtrl.deleteTRowItem(currentItem.id);

    //   Update inventory totals
    setInventroyTotals();

    // Clear edit

    UICtrl.clearEditState();

    e.preventDefault();
  };

  // Clear all submit
  const clearAllItemsSubmit = function(e) {
    // Clear items in data structure
    ItemCtrl.clearAllItems();

    // Remove all items from UI
    UICtrl.removeItems();

    //   Update inventory totals
    setInventroyTotals();

    e.preventDefault();
  };

  //   Public methods
  return {
    // initialize app
    init: function() {
      console.log("Initializing app...");

      // Clear edit state/ set initial set
      UICtrl.clearEditState();

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
})(ItemController, StorageController, UIController);

// Start the app

App.init();
