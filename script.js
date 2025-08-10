document.addEventListener('DOMContentLoaded', () => {
    const display = document.getElementById('result');
    const buttons = document.querySelectorAll('button');
    
    let firstNumber = '';
    let currentOperator = '';
    let secondNumber = '';
    let shouldResetDisplay = false;

    // Add click event listeners to all buttons
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const value = button.textContent;

            // Handle number input
            if (button.classList.contains('number')) {
                handleNumberInput(value);
            }
            // Handle operator input
            else if (button.classList.contains('operator')) {
                handleOperator(value);
            }
            // Handle equals
            else if (button.classList.contains('equals')) {
                calculateResult();
            }
            // Handle clear
            else if (button.classList.contains('clear')) {
                clearCalculator();
            }
            // Handle erase
            else if (button.classList.contains('erase')) {
                handleErase();
            }
        });
    });

    function handleErase() {
        if (display.value.length > 0 && !shouldResetDisplay) {
            display.value = display.value.slice(0, -1);
        }
    }

    function handleNumberInput(number) {
        if (shouldResetDisplay) {
            display.value = '';
            shouldResetDisplay = false;
        }
        display.value += number;
    }

    function handleOperator(operator) {
        if (firstNumber === '') {
            firstNumber = display.value;
            currentOperator = operator;
            shouldResetDisplay = true;
        } else {
            // If an operator is pressed after a previous operation
            calculateResult();
            firstNumber = display.value;
            currentOperator = operator;
            shouldResetDisplay = true;
        }
    }

    function calculateResult() {
        if (firstNumber === '' || currentOperator === '') return;

        secondNumber = display.value;
        let result;

        // Convert string inputs to numbers
        const num1 = parseFloat(firstNumber);
        const num2 = parseFloat(secondNumber);

        // Check for invalid inputs
        if (isNaN(num1) || isNaN(num2)) {
            showError('Invalid input');
            return;
        }

        // Perform calculation based on operator
        try {
            switch (currentOperator) {
                case '+':
                    result = num1 + num2;
                    break;
                case '-':
                    result = num1 - num2;
                    break;
                case '×':
                    result = num1 * num2;
                    break;
                case '÷':
                    if (num2 === 0) {
                        showError('Cannot divide by zero');
                        return;
                    }
                    result = num1 / num2;
                    break;
                default:
                    showError('Invalid operator');
                    return;
            }

            // Check if result is too large or infinite
            if (!isFinite(result)) {
                showError('Result too large');
                return;
            }

            // Round the result to avoid floating point issues
            result = parseFloat(result.toFixed(8));
            
            // Display the result
            display.value = result;

            // Reset for next calculation
            firstNumber = '';
            currentOperator = '';
            shouldResetDisplay = true;
        } catch (error) {
            showError('Calculation error');
        }
    }

    function showError(message) {
        display.value = message;
        display.classList.add('error');
        firstNumber = '';
        currentOperator = '';
        shouldResetDisplay = true;
        
        // Remove error class after 1.5 seconds
        setTimeout(() => {
            display.classList.remove('error');
            if (display.value === message) {
                display.value = '';
            }
        }, 1500);
    }

    function clearCalculator() {
        // Clear all variables
        display.value = '';
        firstNumber = '';
        currentOperator = '';
        secondNumber = '';
        shouldResetDisplay = false;
        
        // Remove any error styling
        display.classList.remove('error');
        
        // Remove any button highlighting
        buttons.forEach(button => {
            button.classList.remove('active');
        });
    }

    // Add keyboard support
    document.addEventListener('keydown', (event) => {
        const key = event.key;

        // Number keys (0-9)
        if (/^[0-9]$/.test(key)) {
            const numberButton = Array.from(buttons).find(button => 
                button.classList.contains('number') && button.textContent === key
            );
            if (numberButton) numberButton.click();
        }

        // Operator keys
        switch (key) {
            case '+':
            case '-':
                const operatorButton = Array.from(buttons).find(button => 
                    button.classList.contains('operator') && button.textContent === key
                );
                if (operatorButton) operatorButton.click();
                break;
            case '*':
                const multiplyButton = Array.from(buttons).find(button => 
                    button.classList.contains('operator') && button.textContent === '×'
                );
                if (multiplyButton) multiplyButton.click();
                break;
            case '/':
                const divideButton = Array.from(buttons).find(button => 
                    button.classList.contains('operator') && button.textContent === '÷'
                );
                if (divideButton) divideButton.click();
                break;
            case 'Enter':
            case '=':
                const equalsButton = Array.from(buttons).find(button => 
                    button.classList.contains('equals')
                );
                if (equalsButton) equalsButton.click();
                break;
            case 'Escape':
            case 'c':
            case 'C':
                const clearButton = Array.from(buttons).find(button => 
                    button.classList.contains('clear')
                );
                if (clearButton) clearButton.click();
                break;
            case 'Backspace':
                const eraseButton = Array.from(buttons).find(button => 
                    button.classList.contains('erase')
                );
                if (eraseButton) eraseButton.click();
                break;
        }
    });
});
