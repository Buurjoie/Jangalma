import { Component, OnInit } from '@angular/core';
import * as math from 'mathjs';

@Component({
  selector: 'app-calculator',
  templateUrl: './calculator.page.html',
  styleUrls: ['./calculator.page.scss'],
})
export class CalculatorPage{

  currentNumber = '0';
  displayNumber = '';
  lastOperator = '';
  result = '';

  constructor() {}

  private handleNumber(value: string) {
    if (this.currentNumber === '0') {
      this.currentNumber = value;
    } else {
      this.currentNumber += value;
    }
  }

  private handleOperator(value: string) {
    if (this.currentNumber !== '') {
      this.displayNumber += this.currentNumber + value;
      this.lastOperator = value;
      this.currentNumber = '';
    }
  }

  private handleSpecialOperator(value: string) {
    if (this.currentNumber !== '') {
      switch (value) {
        case '%':
          this.currentNumber = math.evaluate(this.currentNumber + '/100').toString();
          break;
        case 'sqrt':
          this.currentNumber = math.sqrt(parseFloat(this.currentNumber)).toString();
          break;
        case '!':
          this.currentNumber = math.factorial(parseFloat(this.currentNumber)).toString();
          break;
        case 'sin':
          this.currentNumber = math.sin(math.unit(parseFloat(this.currentNumber), 'deg')).toString();
          break;
        case 'cos':
          this.currentNumber = math.cos(math.unit(parseFloat(this.currentNumber), 'deg')).toString();
          break;
        case 'tan':
          this.currentNumber = math.tan(math.unit(parseFloat(this.currentNumber), 'deg')).toString();
          break;
      }
    }
  }

  public onButtonPress(value: string) {
    if (value === '=') {
      this.calculateResult();
    } else if (['+', '-', '*', '/'].indexOf(value) > -1) {
      this.handleOperator(value);
    } else if (['%', 'sqrt', '!', 'sin', 'cos', 'tan'].indexOf(value) > -1) {
      this.handleSpecialOperator(value);
    } else if (value === '(' || value === ')') {
      this.displayNumber += value;
    } else {
      this.handleNumber(value);
    }
  }

  private calculateResult() {
    try {
      this.displayNumber += this.currentNumber;
      this.result = math.evaluate(this.displayNumber).toString();
      this.currentNumber = this.result;
      this.displayNumber = '';
      this.lastOperator = '';
    } catch (error) {
      this.reset();
    }
  }

  public reset() {
    this.currentNumber = '0';
    this.displayNumber = '';
    this.lastOperator = '';
    this.result = '';
  }
}

