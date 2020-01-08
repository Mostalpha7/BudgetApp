// Budget Controller
const BudgetCtrl = (function () {
  const Expense = function (id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
    this.percentage = -1;
  }
  Expense.prototype.calcPercentages = function (TotalInc) {
    if (TotalInc > 0) {
      this.percentage = Math.round((this.value / TotalInc) * 100)
    } else {
      this.percentage = -1
    }
  }
  Expense.prototype.getPercentages = function () {
    return this.percentage;
  }

  const Income = function (id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value
  }
  calculateTotal = function (type) {
    let sum = 0;
    data.allItems[type].forEach(function (item) {
      sum += item.value;
    })
    data.totals[type] = sum;
  }

  const data = {
    allItems: {
      exp: [],
      inc: []
    },
    totals: {
      exp: 0,
      inc: 0
    },
    budget: 0,
    percentage: -1,
  }


  // Public Methods
  return {
    addItem: function (type, des, val) {
      let newItem, id;
      if (data.allItems[type].length > 0) {
        id = data.allItems[type][data.allItems[type].length - 1].id + 1
      } else {
        id = 0
      }

      if (type === 'inc') {
        newItem = new Income(id, des, val)
      } else if (type === 'exp') {
        newItem = new Expense(id, des, val)
      }

      data.allItems[type].push(newItem);
      return newItem;
    },
    calculateBudget: function () {
      calculateTotal('inc');
      calculateTotal('exp');

      // calculate budget
      data.budget = (data.totals.inc - data.totals.exp)

      // calculate percentage
      if (data.totals.inc >= data.totals.exp) {
        data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100)
      } else {
        data.percentage = -1
      }

    },
    getBudget: function () {
      return {
        budget: data.budget,
        totalInc: data.totals.inc,
        totalExp: data.totals.exp,
        percentage: data.percentage

      }
    },
    deleteItem: function (type, ID) {
      let ids, index;

      ids = data.allItems[type].map(function (item) {
        return item.id
      });
      index = ids.indexOf(ID);
      if (index !== -1) {
        data.allItems[type].splice(index, 1);
      }
    },
    calculatePercentages: function () {
      data.allItems.exp.forEach(function (item) {
        item.calcPercentages(data.totals.inc);
      })
    },
    getPercentages: function () {
      let allPerc = data.allItems.exp.map(function (item) {
        return item.getPercentages()
      })
      return allPerc;
    },
    testing: function () {
      return data
    },
  }


})();

// UI Controller
const UICtrl = (function () {
  const DomStrings = {
    inputType: '.add__type',
    inputDescription: '.add__description',
    inputValue: '.add__value',
    inputBtn: '.add__btn',
    incomeContainer: '.income__list',
    expenseContainer: '.expenses__list',
    budgetLabel: '.budget__value',
    incomeLabel: '.budget__income--value',
    expenseLabel: '.budget__expenses--value',
    percentage: '.budget__expenses--percentage',
    container: '.container',
    expensePercLabel: '.item__percentage',
    dateLabel: '.budget__title--month'
  }


  const formatNumber = function (num, type) {
    let numSplit, int, dec;
    num = Math.abs(num);
    num = num.toFixed(2)

    numSplit = num.split('.')
    int = numSplit[0]
    if (int.length > 3) {
      int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3);
    }

    dec = numSplit[1]
    return (type === 'exp' ? '-' : '+') + ' ' + int + '.' + dec

  };

  // Public Methods
  return {
    // Getting input values
    getInput: function () {
      return {
        type: document.querySelector(DomStrings.inputType).value,
        description: document.querySelector(DomStrings.inputDescription).value,
        value: parseFloat(document.querySelector(DomStrings.inputValue).value)
      }
    },
    // Uputing input datas in the UI
    addListItem: function (obj, type) {
      let html, element;
      if (type === "inc") {
        element = DomStrings.incomeContainer;
        html = `<div class="item clearfix" id="inc-${obj.id}">
        <div class="item__description">${obj.description}</div>
        <div class="right clearfix">
            <div class="item__value">${formatNumber(obj.value, type)}</div>
            <div class="item__delete">
                <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
            </div>
        </div>
        </div>`
      } else if (type === 'exp') {
        element = DomStrings.expenseContainer;
        html = `<div class="item clearfix" id="exp-${obj.id}">
        <div class="item__description">${obj.description}</div>
        <div class="right clearfix">
            <div class="item__value">${formatNumber(obj.value, type)}</div>
            <div class="item__percentage">21%</div>
            <div class="item__delete">
                <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
            </div>
        </div>
        </div>`
      }
      document.querySelector(element).insertAdjacentHTML('beforeend', html)
    },
    // clear input field
    clearField: function () {
      document.querySelector(DomStrings.inputDescription).value = '';
      document.querySelector(DomStrings.inputValue).value = '';
    },
    displayBudget: function (obj) {
      let type;
      obj.budget > 0 ? type = 'inc' : type = 'exp';
      document.querySelector(DomStrings.budgetLabel).innerHTML = `${formatNumber(obj.budget, type)}`;
      document.querySelector(DomStrings.incomeLabel).innerHTML = `${formatNumber(obj.totalInc, 'inc')}`;
      document.querySelector(DomStrings.expenseLabel).innerHTML = `${formatNumber(obj.totalExp, 'exp')}`;
      if (obj.percentage > 0) {
        document.querySelector(DomStrings.percentage).innerHTML = `${obj.percentage}`;
      }
      else {
        document.querySelector(DomStrings.percentage).innerHTML = `--`;
      }
    },

    // Delete list item
    deleteListItem: function (selectedId) {
      let el = document.getElementById(selectedId);
      el.parentNode.removeChild(el)
    },

    // Displaying percentages
    displayPercentages: function (percentages) {
      let per = document.querySelectorAll(DomStrings.expensePercLabel);
      per = Array.from(per);
      per.forEach(function (item, index) {
        item.innerHTML = `${percentages[index]}%`
      })
    },
    // Date
    displayMonth: function () {
      let now, month, year, months;
      now = new Date();
      months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      month = now.getMonth()
      year = now.getFullYear();
      document.querySelector(DomStrings.dateLabel).innerHTML = months[month] + ' ' + year
    },

    // Selectors
    getDomStrings: function () {
      return DomStrings;
    }
  };

})();


// Main App Controller
const AppCtrl = (function (BudgetCtrl, UICtrl) {
  // Dom Events and Selection 
  const setupEventListeners = function () {
    // Targeting Enter and Check while clicked
    document.querySelector(UICtrl.getDomStrings().inputBtn).addEventListener('click', getInputValues);
    document.addEventListener('keypress', function (e) {
      if (e.keyCode === 13 || e.which === 13) {
        getInputValues()
      }
    });
    document.querySelector(UICtrl.getDomStrings().container).addEventListener('click', deleteItem)
  }
  // Update Budget function
  const updateBudget = function () {
    // calculate the budget
    BudgetCtrl.calculateBudget()
    // return the budge
    const budget = BudgetCtrl.getBudget()
    // Display in the UI
    UICtrl.displayBudget(budget)
  };

  const updatePercentages = function () {
    // Calculating the percentages
    BudgetCtrl.calculatePercentages();
    // Returning the percentages
    const percentages = BudgetCtrl.getPercentages()
    // Outputing the percentages in the UI
    UICtrl.displayPercentages(percentages)



  }

  // Get InputValues Function
  const getInputValues = function () {
    // Get input fields
    const input = UICtrl.getInput();
    if (input.description !== "" && input.value > 0) {
      // Add input to the budget controller
      const newItem = BudgetCtrl.addItem(input.type, input.description, input.value)
      // Add input to the UI
      UICtrl.addListItem(newItem, input.type)
      // Clear input field
      UICtrl.clearField();
      // updateBudget
      updateBudget();
      // Calculate and update percentages
      updatePercentages();
    }
  }

  // Delete Item Function
  const deleteItem = function (e) {
    let itemID, splitID, type, ID;
    itemID = e.target.parentNode.parentNode.parentNode.parentNode.id;
    if (itemID) {
      // get the items to 
      splitID = itemID.split('-')
      type = splitID[0];
      ID = parseInt(splitID[1])
      // Delete item in the Budget controller
      BudgetCtrl.deleteItem(type, ID)
      // Update UI
      UICtrl.deleteListItem(itemID);
      // Update budget
      updateBudget();
      // Update and calculate Percentages
      updatePercentages()
    }
  }

  // Public Functions
  return {
    init: function () {
      console.log('Application is ready');
      UICtrl.displayMonth();
      UICtrl.displayBudget({
        budget: 0,
        totalInc: 0,
        totalExp: 0,
        percentage: -1
      })
      setupEventListeners();
    }
  }

})(BudgetCtrl, UICtrl);

AppCtrl.init()
