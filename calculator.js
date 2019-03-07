// State variables
let isSelectingRow = true;
let selectedRow = 0;
let selectedCol = 0;
let numSwitches = 1;

// add the selected class to an item. you can pass this any jquery selector, such as #id or .class
// calling this will de-select anything currently selected
function selectItem(name) {
  $('.cursor').removeClass('cursor');
  $(name).addClass('cursor')
}

// the next four functions move the selected UI control
// this uses the array buttonOrder to know the order of the buttons. so you could change buttonOrder
// to change the order that controls are highlighted/
// if no button is currently selected, such as when the page loads, this will select the first
// item in buttonOrder (which is the 7 button)
// selectNext: go to the right, wrapping around to the next row
// selectPrevious: go to the left, wrapping around to the previous row
// selectUp: select the item above
// selectDown: select the item below

function selectNext() {
	console.log( 'next');
    if ( isSelectingRow  ) {
    	selectedRow = selectedRow % 4 + 1;
    	selectItem( '.row' + selectedRow );
    }
    else if ( selectedCol === 4  ) {
    	isSelectingRow = true;
    	selectItem( '.row' + selectedRow );
    }
    else {
    	selectedCol = selectedCol % 4 + 1;
    	selectItem( '.row' + selectedRow + '.col' + selectedCol );
    }
}

// actuate the currently selected item
// if no item is selected, this does nothing
// if multiple items are selected, this selects the first
function clickSelectedItem() {
	$( '.row' + selectedRow + '.col' + selectedCol ).click();
}

// this function responds to user key presses
// you'll rewrite this to control your interface using some number of keys
$( document ).keypress( function( event ) {
	console.log(event.key, numSwitches);
  if ( event.key === 'a' ) {
  	if ( isSelectingRow ) {
  		isSelectingRow = false;
  		selectedCol = 0;
  	}
  	else {
  		clickSelectedItem();
  		isSelectingRow = true;
  		selectedRow = 0;
  	}
  	selectNext();
  }

console.log(event.key, numSwitches)
  if ( event.key === 'b' && numSwitches === 2 ) {
  	console.log('bee')
  	selectNext();
  }
  else {
  	console.log('weee')
  }
});

setInterval( () => {
	console.log( numSwitches, isSelectingRow, selectedRow, selectedCol );
  if ( numSwitches === 1 ) {
    selectNext();
  }
}, 750 );

$( 'input[name=num-switches]' ).click( () => {
	isSelectingRow = true;
	selectedRow = 0;
	selectedCol = 0;
	selectItem(null)
	numSwitches = $('input[name=num-switches]:checked').val();
} );


/* calculator stuff below here */
// for operations, we'll save + - / *
firstValue = null;
operation = null;
addingNumber = false;

digits = "0123456789"
operators = "+-*/"

// handle calculator functions. all buttons with class calcButton will be handled here
$(".calcButton").click(function(event) {
  buttonLabel = $(this).text();
  
  // if it's a number, add it to our display
  if (digits.indexOf(buttonLabel) != -1) {
    // if we weren't just adding a number, clear our screen
    if (!addingNumber) {
      $("#number_input").val("")
    }
    $("#number_input").val($("#number_input").val() + buttonLabel);
    addingNumber = true;
  // if it's an operator, push the current value onto the stack
  } else if (operators.indexOf(buttonLabel) != -1) {
    // have we added a number? if so, check our stack
    if (addingNumber) {
      // is this the first number on the stack?
      // if so, save it
      if (firstValue == null) {
        firstValue = $("#number_input").val();
        addingNumber = false;
      // do we have a number on the stack already? if so, this is the same as equals
      } else if (firstValue != null) {
        secondValue = $("#number_input").val();
        evaluateExpression(firstValue,operation,secondValue)
        // in this case, keep the operation
        firstValue = $("#number_input").val();
        addingNumber = false;
      }
    }
    // either way, save this as the most recent operation
    operation = buttonLabel;
  } else if (buttonLabel == "C") {
    $("#number_input").val("");
    firstValue = null;
    operation = null;
    addingNumber = false;
  } else if (buttonLabel == "=") {
    if (firstValue != null && operation != null && addingNumber) {
      secondValue = $("#number_input").val();
      evaluateExpression(firstValue,operation,secondValue);
      // clear our state
      firstValue = null;
      operation = null;
      addingNumber = true
    }
  }
})

// do the math for our calculator
function evaluateExpression(first,op,second) {
  output = 0;
  if (op == "+") {
    output = parseInt(first) + parseInt(second);
  } else if (op == "-") {
    output = parseInt(first) - parseInt(second);
  } else if (op == "*") {
    output = parseInt(first) * parseInt(second);
  } else if (op == "/") {
    output = parseInt(first) / parseInt(second);
  }
  
  // now, handle it
  $("#number_input").val(output.toString());
  // deal with state elsewhere
}