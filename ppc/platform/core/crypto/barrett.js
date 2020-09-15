/*
 * Crypt.Barrett, a class for performing Barrett modular reduction computations in
 * JavaScript.
 *
 * Requires BigInt.js.
 *
 * Copyright 2004-2005 David Shapiro.
 *
 * You may use, re-use, abuse, copy, and modify this code to your liking, but
 * please keep this header.
 *
 * Thanks!
 * 
 * @author Dave Shapiro <dave AT ohdave DOT com>
 */

// #ifdef __WITH_BARRETT || __WITH_RSA

/**
 * A class for performing Barrett modular reduction computations in JavaScript.
 *
 * @param {ppc.crypto.BigInt} m
 */
ppc.crypto.Barrett = function(){this.init.apply(this, arguments);};
ppc.crypto.Barrett.prototype = {
    init: function(m) {
        this.modulus = ppc.crypto.BigInt.copy(m);
        this.k = ppc.crypto.BigInt.highIndex(this.modulus) + 1;
        var b2k = new ppc.crypto.BigInt.construct();
        b2k.digits[2 * this.k] = 1; // b2k = b^(2k)
        this.mu = ppc.crypto.BigInt.divide(b2k, this.modulus);
        this.bkplus1 = new ppc.crypto.BigInt.construct();
        this.bkplus1.digits[this.k + 1] = 1; // bkplus1 = b^(k+1)
    },
    modulo: function(x) {
        var q1 = ppc.crypto.BigInt.divideByRadixPower(x, this.k - 1);
        var q2 = ppc.crypto.BigInt.multiply(q1, this.mu);
        var q3 = ppc.crypto.BigInt.divideByRadixPower(q2, this.k + 1);
        var r1 = ppc.crypto.BigInt.moduloByRadixPower(x, this.k + 1);
        var r2term = ppc.crypto.BigInt.multiply(q3, this.modulus);
        var r2 = ppc.crypto.BigInt.moduloByRadixPower(r2term, this.k + 1);
        var r = ppc.crypto.BigInt.subtract(r1, r2);
        if (r.isNeg) {
            r = ppc.crypto.BigInt.add(r, this.bkplus1);
        }
        var rgtem = ppc.crypto.BigInt.compare(r, this.modulus) >= 0;
        while (rgtem) {
            r = ppc.crypto.BigInt.subtract(r, this.modulus);
            rgtem = ppc.crypto.BigInt.compare(r, this.modulus) >= 0;
        }
        return r;
    },
    multiplyMod: function(x, y) {
        /*
         * x = this.modulo(x);
         * y = this.modulo(y);
         */
        var xy = ppc.crypto.BigInt.multiply(x, y);
        return this.modulo(xy);
    },
    powMod: function(x, y) {
        var result = new ppc.crypto.BigInt.construct();
        result.digits[0] = 1;
        var a = x;
        var k = y;
        while (true) {
            if ((k.digits[0] & 1) != 0) result = this.multiplyMod(result, a);
            k = ppc.crypto.BigInt.shiftRight(k, 1);
            if (k.digits[0] == 0 && ppc.crypto.BigInt.highIndex(k) == 0) break;
            a = this.multiplyMod(a, a);
        }
        return result;
    }
};

//#endif
