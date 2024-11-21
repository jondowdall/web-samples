# Node Types

## Continuation Node
 
### Pattern 
   &<value>

## Variable Node
 
### Pattern 
   $<variable> = <value>

## Extension Node
 
### Pattern 
   *<value>

## Generator Node
 
### Pattern 
   +<value>

## JSON Node
 
### Pattern 
   !JSON<value>

## Update Node
 
### Pattern 
   ~<value>

## Default Node
 
### Pattern 
   !<value>

## Documentation Node
 
### Pattern 
   <name [-a-zA-Z0-9 _]>:

## View Node
 
### Pattern 
   ::<view>

## Group Node
 
### Pattern 
   [<list>] <name>

## Template Node
 
### Pattern 
   <node line>[<list>]

## Reference Node
 
### Pattern 
   <<parameter> = <value>>

## Conditional Node
 
### Pattern 
   [<expr>] <value>

## Pattern Node
 
### Pattern 
   !/<pattern>/<flags [ig]> -> <replacement>

## Import Node
 
### Pattern 
   --<<url>> --

## Parsed Pattern Node
 
### Pattern 
   /<pattern>/<flags [ig]> -> <replacement>

## Format Node
 
### Pattern 
   $<format>

## Table Node
 
### Pattern 
   |<headings>

## Path Node
 
### Pattern 
   [\./]<value>

## Plain Node
 
### Pattern 
   <value>