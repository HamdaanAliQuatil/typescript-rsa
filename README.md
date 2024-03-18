# typescript-rsa

> [!CAUTION]
> One should avoid implementing their own cryptographic algorithms due to concerns over Side Channel Attacks and Heartbleed vulnerabilities. This is a learning project for CSC604 and should not be used in production.

<!-- GOAL -->
## Goal
We will first implement the textbook RSA algorithm as mentioned in Introduction to Crytpography by Behrouz A. Forouzan. 
We will then look for ways to optimize it and patch some of the known vulnerabilities.


## Issues Encountered
1. **Prime Number Generation**: Cannot use ArrayBuffers with BigInts in Calculations using the inbuilt `crypto` library.
    - ***Solution***: Create a custom prime number generator using the Miller-Rabin Primality Test.
    - ***Downside***: The custom prime number generator is not as fast as the inbuilt `crypto` library.
