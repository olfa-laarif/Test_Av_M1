import { describe, test, expect } from "vitest";

function isPalindrome(word: string): boolean {
    const lower = word.toLowerCase();
    return lower === lower.split("").reverse().join("");
}

function palindrome(input: string):string[]{

    var words=input.split(' ');
    const result: string[] = [];
    for (const word of words) {

        if( word.length > 1 && isPalindrome(word)){
            result.push(word);
        }
    }
    console.log(result);
    return result;
}

describe ("palindrome", ()=> {
    test("shouldReturnTabVide", () => {
        expect(palindrome("")).toEqual([]);
    });
    test("shouldReturnTabVide", () => {
        expect(palindrome("A")).toEqual([]);
    });
    test("shouldReturnAA", () => {
        expect(palindrome("AA")).toEqual(["AA"]);
    });
    test("shouldReturnAA C", () => {
        expect(palindrome("AA C")).toEqual(["AA"]);
    });
    test("shouldReturnAA BB", () => {
        expect(palindrome("AA BB")).toEqual(["AA","BB"]);
    });
    test("shouldReturnTabradar", () => {
        expect(palindrome("radar")).toEqual(["radar"]);
    });
    test("shouldReturnTabradar  kayak", () => {
        expect(palindrome("radar kayak hello")).toEqual(["radar","kayak"]);
    });
    test("shouldReturnradar  kayak", () => {
        expect(palindrome("radar   Kayak Hello")).toEqual(["radar","Kayak"]);
    });
});
