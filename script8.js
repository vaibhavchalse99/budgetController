var UIController = (function() {
    // some code
    var domString = {
        option : '.select',
        in1 : '.input1',
        in2 : '.input2',
        but : '.material-icons'
    }

    return {
        retValue : function() {
            return {
            sign : document.querySelector(domString.option).value,
            text : document.querySelector(domString.in1).value,
            value :parseFloat(document.querySelector(domString.in2).value)  
            };
        },
        retDom : function () {
            return domString;
        },
        addEle : function(type,obj) {
            var html,newHtml;
            var element;
            if(type === 'inc') {
                element = '.incomeside';
                html = ' <div class="i" id="inc-%id%"><div class="income--"><div class="discription">%discription%</div><div class="value">%value%</div><div class="delete-button"><button><i class="fa fa-minus-circle" aria-hidden="true"></i></button></div></div></div>';
            } else if(type ==='exp') {
                element = '.expenseside';
                html = '<div class="e" id="exp-%id%"><div class="expense--"><div class="discription">%discription%</div><div class="value">%value%</div><div class="delete-button"><button><i class="fa fa-minus-circle" aria-hidden="true"></i></button></div></div></div>';
            }
            newHtml =  html.replace('%id%',obj.id);
            newHtml = newHtml.replace('%discription%',obj.discription);
            newHtml = newHtml.replace('%value%',obj.value);

            document.querySelector(element).insertAdjacentHTML('beforeend',newHtml);
        } ,
        clearfield : function () {
            var fields, fieldArray;
            fields = document.querySelectorAll(domString.in1 + ',' +domString.in2);
            fieldArray =  Array.prototype.slice.call(fields);
            fieldArray.forEach(function(current,index,array) {
                current.value ="";
            });
            fieldArray[0].focus();
        },
        
        displayContent : function(obj) {
            document.querySelector('.incomeAmount').textContent = obj.totalIncome;
            document.querySelector('.expensesAmount').textContent = obj.totalExpense;
            document.querySelector('.b').textContent = obj.totalBudget;
            document.querySelector('.expensesPercentage').textContent = obj.totalPercentage + '%';
        },
        remove : function(id) {
            document.getElementById(id).parentNode.removeChild(document.getElementById(id));
        }
    };
})();

var budgetController = (function() {
    var Income = function(id,discription,value) { 
        this.id = id;
        this.discription = discription;
        this.value = value;
    }

    var Expense = function(id,discription,value) { 
        this.id = id;
        this.discription = discription;
        this.value = value;
    }

    var data = {
        arr : {
            inc : [],
            exp : []
        },
        Total : {
            income : 0,
            expense : 0
        },
        
        tbudget : 0,
        percentage : -1
    }
    return {
        addElement : function (type,discription,value) {
           var newItem,ID;
            if(data.arr[type].length > 0) {
                ID = data.arr[type][data.arr[type].length-1].id + 1;
            } else {
                ID = 0;
            }
            if(type === 'inc') {
                newItem = new Income(ID,discription,value);
                data.Total.income += value;
            } else if(type ==='exp'){
               data.Total.expense += value;
                newItem = new Expense(ID,discription,value);
            }
            data.arr[type].push(newItem);
   
            return newItem;
        },
        budget : function () {
            var sum1 = 0 ;
            var sum2 = 0;
               data.arr.inc.forEach(function (cur) {
               
                sum1 += cur.value;  
               }) 
               data.arr.exp.forEach(function(cur) {
                  
                   sum2 += cur.value;
               })
               data.Total.income = sum1;
               data.Total.expense = sum2;

               data.tbudget =  data.Total.income - data.Total.expense;

               data.percentage = Math.round(data.Total.expense*100/data.Total.income) ;
        },
        retbudget: function(){
            return {
                totalIncome : data.Total.income,
                totalExpense :  data.Total.expense,
                totalBudget : data.tbudget,
                totalPercentage : data.percentage 
            }
        },
        del : function(type,id){
            var ids;
            ids = data.arr[type].map(function(cur){
                return cur.id;

            });
            console.log(ids);
            var index = ids.indexOf(id);
            if(index !== -1) {
                data.arr[type].splice(index ,1);
                
            }
            
            console.log(data.arr[type]);

        } 
    }

})();


//GLOBLE CONTROLLER
var controller = (function(UICntrl,budgetCntrl) {

    var set = function(){
        document.querySelector('.incomeAmount').textContent = 0;
        document.querySelector('.expensesAmount').textContent = 0;
        document.querySelector('.b').textContent = 0;
        document.querySelector('.expensesPercentage').textContent = 0 + '%';

    }


    var dom = UICntrl.retDom();
    var submit = function(){
      
        var obj =UICntrl.retValue();
        UICntrl.clearfield();
        var vaibhav = budgetCntrl.addElement(obj.sign, obj.text, obj.value);
        UICntrl.addEle(obj.sign,vaibhav);
        budgetCntrl.budget();
        var newObj =  budgetCntrl.retbudget();
        UICntrl.displayContent(newObj);
    }

    var deleteItem = function(event) {
        var idArr,type,ID;
        var id = event.target.parentNode.parentNode.parentNode.parentNode.id;
        if(id) {
            idArr = id.split('-');
            type = idArr[0];
            ID = parseInt(idArr[1]);
            budgetCntrl.del(type,ID);
            UICntrl.remove(id);
            budgetCntrl.budget();
            var newObj =  budgetCntrl.retbudget();
            UICntrl.displayContent(newObj);
        }
        
        
        
    }

    var init = function() {
        
        document.querySelector(dom.but).addEventListener('click',submit); 
        document.addEventListener('keypress',function(event) {
            if(event.keyCode===13||event.which===13) {
                submit();
            }
        });
        document.querySelector('.bottom').addEventListener('click' ,deleteItem); 
    }
    return {
        initialization : function() {
            set();
            init();
        }
    }
})(UIController,budgetController);


controller.initialization();