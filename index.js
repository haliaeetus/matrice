/*!
 * Matrice
 * Copyright(c) 2018 Benjamin Martin
 */

'use strict';

class Matrix {
    constructor(rows, columns) {
        // elements.length makes storing one of rows/columns redundant
        // columns is more relevant than rows, due to index(row, column) = row * columns + column
        // but both stored for completeness
        this.rows = rows;
        this.columns = columns;

        this.elements = Array(rows * columns);
    }

    set(row, column, value) {
        const index = row * this.columns + column;

        this.elements[index] = value;
    }

    get(row, column) {
        const index = row * this.columns + column;
        return this.elements[index];
    }

    to2DArray() {
        const result = new Array(this.rows);

        for (let i = 0; i < this.rows; i++) {
            const row = result[i] = new Array(this.columns);
            for (let j = 0; j < this.columns; j++) {
                const index = i * this.columns + j;
                row[j] = this.elements[index];
            }
        }

        return result;
    }

    get size() {
        return [this.rows, this.columns];
    }

    get length() {
        return this.elements.length;
    }

    *entries() {
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.columns; j++) {
                yield [[i, j], this.get(i, j)]
            }
        }
    }

    *keys() {
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.columns; j++) {
                yield [i, j]
            }
        }
    }

    *values() {
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.columns; j++) {
                yield this.get(i, j)
            }
        }
    }

    *keys1D() {
        for (let y = 0; y < this.elements.length; y++) {
            yield y;
        }
    }

    *entries1D() {
        for (let y = 0; y < this.elements.length; y++) {
            yield [y, this.elements.y];
        }
    }

    add(right) {
        const result = new this.constructor(this.rows, this.columns);

        for (let [[i, j], value] of this.entries()) {
            result.set(i, j, value + right.get(i, j))
        }

        return result;
    }

    subtract(right) {
        const result = new this.constructor(this.rows, this.columns);

        for (let [[i, j], value] of this.entries()) {
            result.set(i, j, value - right.get(i, j))
        }

        return result;
    }

    scale(factor) {
        const result = new this.constructor(this.rows, this.columns);

        for (let [[i, j], value] of this.entries()) {
            result.set(i, j, this.get(i, j) * factor)
        }

        return result;
    }

    multiply(right) {
        // multiplies this * right

        if (this.columns !== right.rows) {
            throw new Error(`Multiplying A * B requires requires cols(A) === rows(B), but got ${this.size} x ${right.size}`);
        }

        const result = new Matrix(this.rows, right.columns);

        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < right.columns; j++) {

                let sum = 0;
                for (let y = 0; y < this.columns; y++) {
                    sum += this.get(i, y) * right.get(y, j);
                }
                result.set(i, j, sum);
            }
        }

        return result;

    }

    transpose() {
        const result = new this.constructor(this.columns, this.rows);

        for (let i = 0; i < result.rows; i++) {
            for (let j = 0; j < result.columns; j++) {
                result.set(i, j, this.get(j, i))

                // could also do
                // result.push(this.get(j, i))
            }
        }

        return result;
    }

    static identity(size) {
        const result = new Matrix(size, size);

        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                const index = i * size + j;
                result.elements[index] = i === j ? 1 : 0;
            }
        }

        return result;
    }

    static ones(rows, columns) {
        const result = new Matrix(rows, columns);

        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < columns; j++) {
                const index = i * columns + j;
                result.elements[index] = 1;
            }
        }

        return result;
    }

    static zeroes(rows, columns) {
        const result = new Matrix(rows, columns);

        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < columns; j++) {
                const index = i * columns + j;
                result.elements[index] = 0;
            }
        }

        return result;
    }

    static from2DArray(array) {
        const rows = array.length;

        const columnLengths = new Set(array.map(row => row.length));

        if (columnLengths.size > 1) {
            throw new Error(`Each row must have the same number of columns, but instead found column lengths: ${columnLengths}`)
        }

        const columns = array[0].length;

        const matrix = new Matrix(rows, columns);

        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < columns; j++) {
                const element = array[i][j];
                matrix.set(i, j, element);
                // could also do:
                //matrix.elements.push(element);
            }
        }

        return matrix;
    }
}

module.exports = {
    Matrix
}