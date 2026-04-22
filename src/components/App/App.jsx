import "./App.css";

import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";

import demoData from "../../utils/data.json";
import SideNav from "../SideNav/SideNav";
import Invoices from "../Invoices/Invoices";
import Receipt from "../Receipt/Receipt";

function App() {
  const [invoices, setInvoices] = useState([]);
  const [selectedInvoice, setSelectedInvoice] = useState({});

  useEffect(() => {
    setInvoices(JSON.parse(localStorage.getItem("invoices")) || demoData);
  }, []);

  const handleInvoiceClick = (invoice) => {
    setSelectedInvoice(invoice);
  };

  const handleInvoiceDeleteClick = (invoice) => {
    setInvoices(invoices.filter((c) => c.id !== invoice.id));
    saveToLocal(invoices.filter((c) => c.id !== invoice.id));
  };

  const handleMarkAsPaidClick = (invoice) => {
    let newInvoice = invoice;
    newInvoice.status = "paid";
    setInvoices(invoices.map((c) => (c.id === invoice.id ? newInvoice : c)));
    saveToLocal(invoices.map((c) => (c.id === invoice.id ? newInvoice : c)));
  };

  const handleInvoiceSave = (invoice, isNew, isDraft) => {
    let newInvoice = JSON.parse(JSON.stringify(invoice));

    if (isDraft) {
      newInvoice.status = "draft";
    }

    if (isNew) {
      newInvoice.id = invoices[invoices.length - 1].id + "2";
      setInvoices([newInvoice, ...invoices]);
      saveToLocal([newInvoice, ...invoices]);
    } else {
      setInvoices(invoices.map((c) => (c.id === invoice.id ? newInvoice : c)));
      setSelectedInvoice(newInvoice);
      saveToLocal(invoices.map((c) => (c.id === invoice.id ? newInvoice : c)));
    }
  };

  const saveToLocal = (invoices) => {
    localStorage.setItem("invoices", JSON.stringify(invoices));
  };

  return (
    <div className="App">
      <SideNav />

      <Routes>
        <Route
          path="/*"
          element={
            <Invoices
              invoices={invoices}
              onInvoiceClick={handleInvoiceClick}
              onSave={handleInvoiceSave}
            />
          }
        />

        <Route
          path="/reciept"
          element={
            <Receipt
              invoice={selectedInvoice}
              onDelete={handleInvoiceDeleteClick}
              onMark={handleMarkAsPaidClick}
              onSave={handleInvoiceSave}
            />
          }
        />
      </Routes>
    </div>
  );
}

export default App;
