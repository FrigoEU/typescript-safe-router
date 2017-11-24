# typescript-safe-router

A type-safe router for TypeScript. Read the WHY and HOW in this blog post:
https://frigoeu.github.io/typescriptsaferouter.html

Typescript-safe-router is tiny (1kb minified/gzipped), framework-independent and fully type-safe! Make, change and use routes without worrying if you're keeping everything synchronized.

## Usage

```typescript
import {makeRoute, makeRouter} from "typescript-safe-router";

const employeeRoute = makeRoute("employee", {employeeId: "number"});

// Building URL's
employeeRoute.buildUrl({employeeId: 5}); // "#/employee/employeeid/5"

// Matching URL's
employeeRoute.matchUrl("#/employee/employeeid/5") // {employeeId: 5}
employeeRoute.matchUrl("#/employee/employeeid/test") // null

// Building a full router
export const messages = makeRoute("messages", {startDate: "date"});
export const employees = makeRoute("employees", {employeeId: "number"});

makeRouter(
  messages, ({startDate: Date}) => {
    console.log("We've navigated to the messages page!")
    return null;
  }).registerRoute(
  employees, ({employeeId: number}) => {
    console.log("We've navigated to the employees page!")
    return null;
  });

```

## Type definition syntax

The following strings can be used to define the types of your route parameters:

```typescript
"string"
"string | null"
"date"
"date | null"
"number"
"number | null"
"boolean"
"boolean | null"
```

## A full example with React

```typescript
import * as Messages from "./messages";
import * as Employees from "./employee";
import * as React from "react";
import {makeRoute, makeRouter, Router} from "./router";

// Defining what routes we have, and what parameters the urls contain
export const messages = makeRoute("messages", {startDate: "date"});
export const employees = makeRoute("employees", {employeeId: "number"});

class App extends React.Component<{}, {}> {
  private router: Router<JSX.Element>;

  constructor(props: {}) {
    super(props);

    // Defining what we want functions we want router.match to execute for every route
    this.router = makeRouter(
      messages, ({startDate: Date}) => <Message.Page startDate={startDate} />).registerRoute(
      employees, ({employeeId: number}) => <Employees.Page employeeId={employeeId} />);    

    window.onhashchange = () => this.forceUpdate();
  }

  startPage(): JSX.Element {
    return <div>You have arrived at the start page</div>;
  }

  render() {
    let fromRouter = this.router.match(window.location.hash);
    return (fromRouter === null) ? this.startPage() : fromRouter;
  }
}
```
