import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import BanksList from "./pages/banksList/BanksList";
import BankDetails from "./pages/bankDetails/BankDetails";

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/">
          <Redirect to="/all-banks" />
        </Route>
        <Route exact path="/all-banks" component={BanksList}></Route>
        <Route exact path="/bank-details/:ifsc" component={BankDetails}></Route>
        <Route exact path="/favorites" component={BanksList}></Route>
      </Switch>
    </BrowserRouter>
  );
}

export default App;
