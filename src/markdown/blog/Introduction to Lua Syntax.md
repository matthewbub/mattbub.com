---
title: "Introduction to Lua Syntax"
description: "A general syntax guide intended to introduce the basics of Lua programming."
pubDate: "February 27 2024"
---

export const article = {
id: "df56f220aca270c4d032b07472911b336bza73c7421ee09fd5123236306378fa",
author: "Matthew Bub",
date: "2024-02-27T12:10:54.187351+00:00",
title: "Introduction to Lua Syntax",
description: "A general syntax guide intended to introduce the basics of Lua programming.",
tags: ["lua", "programming", "scripting"],
}

Lua is a powerful, efficient, lightweight, and embeddable scripting language.
Due to these features, Lua is frequently used in game engines in placement of C, C++ or similar languages. This also makes Lua a great candidate for embedding into Neovim.

The following is a general syntax guide intended to introduce the basics of Lua programming. **Side note:** be wary that Lua is a forgiving language much like Python or JavaScript.

## Variables

In Lua, variables are dynamically typed, meaning you don't have to declare their type explicitly. Here are some examples of variable declarations:

```lua
myNum = 100                  -- Number
myOtherNum = 20.18           -- Number
myString = "Hello World!"    -- String
myBool = true                -- Boolean
```

## Comments

Lua supports single-line and block comments for adding notes or disabling code:

```lua
-- This is a single-line comment.

--[[
     This is a block comment.
     Everything here is commented out.
--]]
```

## Arithmetic Operations

Lua provides a set of arithmetic operators for performing mathematical calculations:

```lua
myNum = 0
myNum = myNum + 1   -- Incrementing by 1. Lua does not have a "++" operator.

-- Operators:
-- + : Addition            - : Subtraction
-- * : Multiplication      / : Division
-- % : Modulus Division    ^ : Exponent
```

## Conditionals

Conditional statements in Lua allow for branching logic based on conditions:

```lua
if myNum == 0 then
   myNum = myNum + 1
end

-- Comparison operators:
-- == : Equal to                  ~= : Not Equal to
-- >  : Greater than              <  : Less than
-- >= : Greater than or equal to  <= : Less than or equal to

if myNum > 1 then
   result = "myNum is greater than 1"
elseif myNum < 1 then
   result = "myNum is less than 1"
else
   result = "myNum is equal to 1"
end
```

## Loops

Loops are used to repeat a block of code multiple times:

```lua
-- While Loop
while myNum < 50 do
   myNum = myNum + 1
end

-- For Loop
for i=1,100 do
   myNum = myNum + 1
end

-- For Loop with decrement
for i=100,0,-5 do
   myNum = myNum + 1
end
```

## Functions

Functions in Lua are first-class values and can be used to encapsulate and reuse code:

```lua
function isNegative(n)
   if n < 0 then
      return true
   else
      return false
   end
end

isNegative(-15)   -- Returns true

function pow(base, exp)
   return base^exp
end

myVar = isNegative
myVar(20)   -- Returns false
```

## Tables

Tables in Lua are the main data structuring mechanism, similar to arrays or dictionaries in other languages:

```lua
myTable = {}                 -- Creates an empty table
myTable[1] = 'a'             -- Assigns 'a' at index 1
myTable["lua"] = 20          -- Assigns 20 at key "lua"
myTable[1] = nil             -- Removes value at index 1
myTable.name = "Alex"        -- Shortcut for myTable["name"] = "Alex"

otherTable = {2, 3, 5}       -- Initializes a table with values

-- Iterating through a table
for i, n in ipairs(otherTable) do
   result = result + n
end
```
