const {Matrix} = require('./index');

describe('dimensions', () => {
    test('5x3 matrix', () => {
        const m1 = new Matrix(5, 3);

        expect(m1.rows).toBe(5);
        expect(m1.columns).toBe(3);
        expect(m1.length).toBe(15);
    });

    test('3x4 matrix', () => {
        const m2 = new Matrix(3, 4);

        expect(m2.rows).toBe(3);
        expect(m2.columns).toBe(4);
        expect(m2.length).toBe(12);
    })
})

describe('2d array I/O', () => {
    const twoD = [
        [1, 2, 3, 4, 5],
        [6, 7, 8, 9, 10],
        [11, 12, 13, 14, 15]
    ];
    const oneD = new Array(15).fill(0).map((_, e) => e + 1);

    test('from 2D array', () => {
        const matrix = Matrix.from2DArray(twoD);
        expect(matrix.rows).toBe(3)
        expect(matrix.columns).toBe(5)
        expect(matrix.elements).toEqual(oneD);
    });

    test('to 2D array', () => {
        expect(Matrix.from2DArray(twoD).to2DArray()).toEqual(twoD);
    });

    test('from 2d array with invalid dimensions', () => {
        expect(() => {
            Matrix.from2DArray([
                [1, 2, 3, 4],
                [4, 2, 0],
                [1, 3, 3, 7]
            ])
        }).toThrow()
    })
});

describe('basic arithmetic', () => {

    describe('5x3 matrix', () => {
        const m1 = Matrix.from2DArray([
            [-9, -2, -8],
            [1, -6, 5],
            [5, 2, 7],
            [-3, -4, -1],
            [7, 5, 0]
        ]);

        const m2 = Matrix.from2DArray([
            [-7, -5, -9],
            [-8, 2, 8],
            [-9, -6, 3],
            [9, 8, 1],
            [-2, 4, 1]
        ]);

        const sum = [[-16, -7, -17], [-7, -4, 13], [-4, -4, 10], [6, 4, 0], [5, 9, 1]];
        const difference = [[-2, 3, 1], [9, -8, -3], [14, 8, 4], [-12, -12, -2], [9, 1, -1]];

        // all elements are multiples of 3 to avoid floating point error when multiplying by 1/3
        const m3 = Matrix.from2DArray([
            [9, -24, 3],
            [-12, 18, 9],
            [0, 6, 0],
            [0, -21, 12],
            [3, 12, 27]
        ])

        const factorUp = 5;
        const factorDown = 1 / 3;

        const scaledUp3 = [[45, -120, 15], [-60, 90, 45], [0, 30, 0], [0, -105, 60], [15, 60, 135]];
        const scaledDown3 = [[3, -8, 1], [-4, 6, 3], [0, 2, 0], [0, -7, 4], [1, 4, 9]];

        test('sum', () => {
            expect(m1.add(m2).to2DArray()).toEqual(sum)
        });

        test('difference', () => {
            expect(m1.subtract(m2).to2DArray()).toEqual(difference)
        });

        test('scale up', () => {
            expect(m3.scale(factorUp).to2DArray()).toEqual(scaledUp3)
        });

        test('scale down', () => {
            expect(m3.scale(factorDown).to2DArray()).toEqual(scaledDown3)
        });
    });

    describe('3x4 matrix', () => {
        const m1 = Matrix.from2DArray([
            [-9, -2, -8, -3],
            [1, -6, 5, -4],
            [5, 2, 7, -1]
        ]);

        const m2 = Matrix.from2DArray([
            [-7, -5, -9, 9],
            [-8, 2, 8, 8],
            [-9, -6, 3, 1]
        ]);

        const sum = [[-16, -7, -17, 6], [-7, -4, 13, 4], [-4, -4, 10, 0]];
        const difference = [[-2, 3, 1, -12], [9, -8, -3, -12], [14, 8, 4, -2]];

        // all elements are multiples of 3 to avoid floating point error when multiplying by 1/3
        const m3 = Matrix.from2DArray([
            [9, -24, 3, 0],
            [-12, 18, 9, -21],
            [0, 6, 0, 12]
        ])

        const factorUp = 5;
        const factorDown = 1 / 3;

        const scaledUp3 = [[45, -120, 15, 0], [-60, 90, 45, -105], [0, 30, 0, 60]];
        const scaledDown3 = [[3, -8, 1, 0], [-4, 6, 3, -7], [0, 2, 0, 4]];

        test('sum', () => {
            expect(m1.add(m2).to2DArray()).toEqual(sum)
        });

        test('difference', () => {
            expect(m1.subtract(m2).to2DArray()).toEqual(difference)
        });

        test('scale up', () => {
            expect(m3.scale(factorUp).to2DArray()).toEqual(scaledUp3)
        });

        test('scale down', () => {
            expect(m3.scale(factorDown).to2DArray()).toEqual(scaledDown3)
        });
    });

});

describe('')

describe('multiplication', () => {
    test('5x3 * 3x4', () => {
        const m1 = Matrix.from2DArray([
            [24, -27, -18],
            [15, 27, 24],
            [27, -24, -9],
            [21, 6, 18],
            [-27, -27, 9],
        ]);
        const m2 = Matrix.from2DArray([
            [-15, -27, -27, -3],
            [3, 27, 21, 6],
            [0, 21, -12, 0]
        ]);

        const m1m2 = [
            [-441, -1755, -999, -234],
            [-144, 828, -126, 117],
            [-477, -1566, -1125, -225],
            [-297, -27, -657, -27],
            [324, 189, 54, -81]
        ]

        expect(m1.multiply(m2).to2DArray()).toEqual(m1m2)
    });

    test('(q, r) rotation', () => {
        // Rotate (q,r) point by 1/6 of a full rotation
        // Note: (q,r) space refers to projection of R3 unit cubes whose centres are intersected by the plane x + y + z = 0 onto R2 to (q,r) = (x,y) space
        //       Equation of the plane makes z redundant, and (x, y) renamed to (q, r) for clarity
        //       See https://www.redblobgames.com/grids/hexagons/
        const rotationMatrix = Matrix.from2DArray([
            [0, -1],
            [1, 1]
        ]);

        const points = [
            [[4], [-1]],
            [[1], [3]],
            [[-3], [4]],
            [[-4], [1]],
            [[-1], [-3]],
            [[3], [-4]]
        ];

        let point = Matrix.from2DArray(points[0]);

        for (let i = 1; i < 6; i++) {
            point = rotationMatrix.multiply(point);
            expect(point.to2DArray()).toEqual(points[i]);
        }

    })
});

describe('pre-filled', () => {
    describe('identity', () => {
        test('4x4', () => {
            const expected = [[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0], [0, 0, 0, 1]];
            expect(Matrix.identity(4).to2DArray()).toEqual(expected);
        })

        test('6x6', () => {
            const expected = [[1, 0, 0, 0, 0, 0], [0, 1, 0, 0, 0, 0], [0, 0, 1, 0, 0, 0], [0, 0, 0, 1, 0, 0], [0, 0, 0, 0, 1, 0], [0, 0, 0, 0, 0, 1]];;
            expect(Matrix.identity(6).to2DArray()).toEqual(expected);
        })
    })

    describe('ones', () => {
        test('4x4', () => {
            const expected = new Array(16).fill(1);
            expect(Matrix.ones(4,4).elements).toEqual(expected);
        })

        test('6x6', () => {
            const expected = new Array(36).fill(1);
            expect(Matrix.ones(6,6).elements).toEqual(expected);
        })
        test('5x3', () => {
            const expected = new Array(15).fill(1);
            expect(Matrix.ones(5,3).elements).toEqual(expected);
        })

        test('3x4', () => {
            const expected = new Array(12).fill(1);
            expect(Matrix.ones(3,4).elements).toEqual(expected);
        })
    })

    describe('zeroes', () => {
        test('4x4', () => {
            const expected = new Array(16).fill(0);
            expect(Matrix.zeroes(4,4).elements).toEqual(expected);
        })

        test('6x6', () => {
            const expected = new Array(36).fill(0);
            expect(Matrix.zeroes(6,6).elements).toEqual(expected);
        })
        test('5x3', () => {
            const expected = new Array(15).fill(0);
            expect(Matrix.zeroes(5,3).elements).toEqual(expected);
        })

        test('3x4', () => {
            const expected = new Array(12).fill(0);
            expect(Matrix.zeroes(3,4).elements).toEqual(expected);
        })
    })
})




function testMatrix() {
    const matrix = Matrix.from2DArray(
        [
            [1, 2, 3],
            [4, 5, 6],
            [7, 8, 9]
        ]
    )

    console.table(matrix.to2DArray());
    console.log(matrix.elements);

    const originalPoint = Matrix.from2DArray([
        [1],
        [0]
    ])

    const rotationMatrix = Matrix.from2DArray([
        [0, 1],
        [-1, 1]
    ]).transpose();

    let point = originalPoint;

    console.log('No rotation');
    console.table(point.to2DArray())

    for (let i = 1; i < 6; i++) {
        console.log(`${i} Rotation${i === 1 ? '' : 's'}`);
        point = rotationMatrix.multiply(point);
        console.table(point.to2DArray());
    }

    const transposeExample = Matrix.from2DArray([
        [1, 2, 3, 4, 5],
        [6, 7, 8, 9, 10],
        [11, 12, 13, 14, 15]
    ])

    console.table([
        [1, 2, 3, 4, 5],
        [6, 7, 8, 9, 10],
        [11, 12, 13, 14, 15]
    ])

    console.log(transposeExample.elements)
    console.table(transposeExample.to2DArray())
    console.table(transposeExample.transpose().to2DArray())

    const identity4 = Matrix.identity(4);
    console.table(identity4.to2DArray())

}