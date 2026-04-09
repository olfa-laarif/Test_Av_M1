import { describe, test, expect } from "vitest";

function fizzbuzz(count:number){
    let result = "";
    if(count % 3 == 0 ) {

     result+="Fizz";
    }
    if( count % 5 == 0){
      result+="Buzz"
    }
    //return result || count.toString();
    return Object.keys(result).length == 0 ? count : result

}

describe ("fizzbuzz", ()=>{
  test("shouldReturnOneForOne",()=>{
        expect(fizzbuzz(1)).toBe(1)
    })
    test("shouldReturnTwoForTwo",()=>{
        expect(fizzbuzz(2)).toBe(2)
    })
    test("shouldReturnFizz",()=>{
        expect(fizzbuzz(6)).toBe("Fizz")
    })

    test("shouldReturnBuzzFor5",()=>{
        expect(fizzbuzz(5)).toBe("Buzz")
    })
    test("shouldReturnBuzzFor10",()=>{
        expect(fizzbuzz(10)).toBe("Buzz")
    })
    test("shouldReturnBuzzFor15",()=>{
        expect(fizzbuzz(15)).toBe("FizzBuzz")
    })
})