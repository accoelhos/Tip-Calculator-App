import React, { useState } from "react";
import * as Yup from "yup";
import { Formik, Form, Field, ErrorMessage } from "formik";

import "./index.css";



export default function App() {

  const initialValues = {
    conta: "",
    gorjeta: "",
    pessoas: ""
  };
  const validationSchema = Yup.object({
    conta: Yup.number()
      .min(0, "O valor da conta não pode ser negativo")
      .required("O valor da conta é obrigatório"),
    gorjeta: Yup.number()
      .min(0, "A gorjeta não pode ser negativa")
      .required("A gorjeta é obrigatória"),
    pessoas: Yup.number()
      .min(1, "O número de pessoas deve ser no mínimo 1")
      .integer("O número de pessoas deve ser um número inteiro")
      .required("O número de pessoas é obrigatório")
  });
  return (
    <div className="main w-full h-screen">
      <div className="flex flex-col items-center justify-start h-full">
        <h1 className="title text-center mt-10 text-2xl">Tip Calculator</h1>
        <div className="container-infos flex flex-row w-full mt-4">
          <div className="container-inputs flex flex-col flex-1 p-4">
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
            
            >
              {({ values, handleChange, handleBlur, errors, touched, isValid }) => (
            <>
              <Form className="flex flex-col justify-center gap-6">
                <div className="relative">
                  <label htmlFor="conta">Conta</label>
                  <Field
                          type="number"
                          name="conta"
                          id="conta"
                          placeholder="0"
                          className={`input ${touched.conta && errors.conta ? 'input-error' : ''}`}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                        <ErrorMessage name="conta" component="div" className="error-message absolute" />
                  <label htmlFor="gorjeta">Selecione a gorjeta</label>
                  <div className="botoes flex flex-row space-x-10">
                    <button id="btn-gorjeta">
                      5%
                    </button>
                    <button id="btn-gorjeta">
                      10%
                    </button>
                    <button id="btn-gorjeta">
                      15%
                    </button>
                    <button id="btn-gorjeta">
                      20%
                    </button>
                    <button id="btn-gorjeta">
                      25%
                    </button>
                  </div>
                </div>
              </Form>
            </>)}
            </Formik>



          </div>
          <div className="container-results flex flex-col flex-1 p-4">
            {/* Conteúdo dos resultados */}
          </div>
        </div>
      </div>
    </div>
  );
}
