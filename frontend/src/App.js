import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import CreateGroupPage from './pages/Group';
import GroupDetail  from './pages/GroupDetail';
import CreateExpensePage from './pages/Expense';
import Layout from "./components/Layout";
import ExpenseDetails from './pages/ExpenseDetail';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path='/expenses/:id' element={<ExpenseDetails />} />
          <Route path="/groups/:id" element={<GroupDetail />} />
          <Route path='/' element={<CreateGroupPage />} />
          <Route path='/expense' element={<CreateExpensePage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;