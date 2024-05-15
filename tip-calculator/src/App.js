import React, { useState, useEffect } from "react";
import * as Yup from "yup";
import { Formik, Form, Field, ErrorMessage } from "formik";

import "./App.css";

export default function App() {
  const [selectedTip, setSelectedTip] = useState(null);
  const [tipAmount, setTipAmount] = useState(0);
  const [tipPerPerson, setTipPerPerson] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [totalPerPerson, setTotalPerPerson] = useState(0);

  const initialValues = {
    conta: "",
    gorjeta: "",
    pessoas: ""
  };

  const validationSchema = Yup.object().shape({
    conta: Yup.number()
      .min(0, "O valor da conta não pode ser negativo")
      .required("O valor da conta é obrigatório"),
    gorjeta: Yup.number()
      .min(0, "A gorjeta não pode ser negativa")
      .test('gorjeta-required', 'A gorjeta é obrigatória', function(value) {
        const { selectedTip } = this.parent;
        return selectedTip || value !== undefined;
      }),
    pessoas: Yup.number()
      .min(1, "O número de pessoas deve ser no mínimo 1")
      .integer("O número de pessoas deve ser um número inteiro")
      .required("O número de pessoas é obrigatório")
  });

  const calculateResults = (values) => {
    const { conta, gorjeta, pessoas } = values;
    const contaValue = parseFloat(conta) || 0;
    const pessoasValue = parseInt(pessoas, 10) || 1;
    let gorjetaValue = parseFloat(gorjeta) || 0;

    if (selectedTip) {
      gorjetaValue = (contaValue * parseInt(selectedTip) / 100);
    }

    const tipAmountValue = gorjetaValue;
    const totalAmountValue = contaValue + tipAmountValue;
    const tipPerPersonValue = tipAmountValue / pessoasValue;
    const totalPerPersonValue = totalAmountValue / pessoasValue;

    setTipAmount(tipAmountValue);
    setTipPerPerson(tipPerPersonValue);
    setTotalAmount(totalAmountValue);
    setTotalPerPerson(totalPerPersonValue);
  };

  useEffect(() => {
    
    const dummyValues = { conta: "", gorjeta: "", pessoas: "" };
    calculateResults(dummyValues);
  }, [selectedTip]);

  return (
    <div className="main w-full h-screen">
      <div className="flex flex-col items-center justify-start h-full">
        <h1 className="title text-center mt-10 text-2xl">Tip Calculator</h1>
        <div className="container-infos flex flex-row w-full mt-4 gap-4">
          <div className="container-inputs flex flex-col flex-1 p-4">
            <Formik
              initialValues={{ ...initialValues, selectedTip }}
              validationSchema={validationSchema}
              onSubmit={(values) => {
                console.log(values);
              }}
            >
              {({ values, handleChange, handleBlur, errors, touched, setFieldValue, isValid, resetForm }) => (
                <Form className="flex flex-col justify-center gap-6">
                  <div className="infos-tip">
                    <label htmlFor="conta">Conta</label>
                    <Field
                      type="number"
                      name="conta"
                      id="conta"
                      placeholder="R$00.00"
                      className={`input ${touched.conta && errors.conta ? 'input-error' : ''}`}
                      onChange={(e) => {
                        handleChange(e);
                        calculateResults({ ...values, conta: e.target.value });
                      }}
                      onBlur={handleBlur}
                    />
                    <ErrorMessage name="conta" component="div" className="error-message absolute" />
                  </div>
                  <div className="infos-tip">
                    <label htmlFor="gorjeta">Selecione a gorjeta</label>
                    <div className="botoes grid grid-cols-1 md:grid-cols-3 gap-4">
                      {['5%', '10%', '15%', '20%', '25%'].map((tip, index) => (
                        <button
                          key={index}
                          type="button"
                          id="btn-gorjeta"
                          className={`btn-gorjeta ${selectedTip === tip ? 'selected' : ''}`}
                          onClick={() => {
                            setSelectedTip(tip);
                            setFieldValue('selectedTip', tip);
                            setFieldValue('gorjeta', '');
                            calculateResults({ ...values, gorjeta: '', selectedTip: tip });
                          }}
                        >
                          {tip}
                        </button>
                      ))}
                      <div className="field-container">
                        <Field
                          type="number"
                          name="gorjeta"
                          id="gorjeta"
                          placeholder="Outro"
                          className={`input ${touched.gorjeta && errors.gorjeta ? 'input-error' : ''}`}
                          onChange={(e) => {
                            handleChange(e);
                            setSelectedTip(null);
                            setFieldValue('selectedTip', null);
                            calculateResults({ ...values, gorjeta: e.target.value });
                          }}
                          onBlur={handleBlur}
                        />
                        <ErrorMessage name="gorjeta" component="div" className="error-message absolute" />
                      </div>
                    </div>
                  </div>
                  <div className="infos-tip">
                    <label htmlFor="pessoas">Número de pessoas</label>
                    <Field
                      type="number"
                      name="pessoas"
                      id="num-pessoas"
                      placeholder="0"
                      className={`input ${touched.pessoas && errors.pessoas ? 'input-error' : ''}`}
                      onChange={(e) => {
                        handleChange(e);
                        calculateResults({ ...values, pessoas: e.target.value });
                      }}
                      onBlur={handleBlur}
                    />
                    <ErrorMessage name="pessoas" component="div" className="error-message absolute" />
                  </div>
                </Form>
              )}
            </Formik>
          </div>
          <div className="container-results flex flex-col flex-1 p-4">
            <div className="line-results flex flex-row gap-16 mb-5 mt-3">
              <label htmlFor="gorjeta" className="title-results">Valor da gorjeta</label>
              <p className="valor">R$ {tipAmount.toFixed(2)}</p>
            </div>
            <div className="line-results flex flex-row gap-16 mb-5">
              <label htmlFor="gorjeta" className="title-results">Gorjeta / pessoa</label>
              <p className="valor">R$ {tipPerPerson.toFixed(2)}</p>
            </div>
            <div className="line-results flex flex-row mb-5" id="conta">
              <label htmlFor="gorjeta" className="title-results">Valor da conta</label>
              <p className="valor">R$ {totalAmount.toFixed(2)}</p>
            </div>
            <div className="line-results flex flex-row gap-20 mb-5" id="conta">
              <label htmlFor="gorjeta" className="title-results">Conta / pessoa</label>
              <p className="valor">R$ {totalPerPerson.toFixed(2)}</p>
            </div>
            <button
              type="button"
              className="reset"
              onClick={() => {
                setSelectedTip(null);
                setTipAmount(0);
                setTipPerPerson(0);
                setTotalAmount(0);
                setTotalPerPerson(0);
                document.querySelector('form').reset();
              }}
            >
              Reiniciar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
