import {it,expect} from 'vitest';
import {parseProgress} from '../src/lib/storage';

it.each(['null','[]','42','"read"','{bad json'])('ignores malformed progress %s',raw=>{
 expect(Object.keys(parseProgress(raw))).toEqual([]);
});
it('keeps only explicit learning statuses and safe lesson IDs',()=>{
 const result=parseProgress('{"deutsch":"read","grover":"practiced","qft":"revisit","shor":"complete","simon":{},"__proto__":"read"}');
 expect({...result}).toEqual({deutsch:'read',grover:'practiced',qft:'revisit'});
 expect(Object.getPrototypeOf(result)).toBeNull();
});
