import { Route, Routes } from "react-router-dom";
       
import { HomePages } from "../pages/HomePages";

import { FilmesList } from "../pages/FilmesPages/FilmesList";
import { FilmesForm } from "../pages/FilmesPages/FilmesForm";

import { SalasList } from "../pages/SalasPages/SalasList";
import { SalasForm } from "../pages/SalasPages/SalasForm";

import { SessoesList } from "../pages/SessoesPages/SessoesList";
import { SessoesForm } from "../pages/SessoesPages/SessoesForm";

import { LanchesList } from "../pages/LanchesPages/LanchesList";
import { LanchesForm } from "../pages/LanchesPages/LanchesForm";

import { IngressosForm } from "../pages/IngressosPages/IngressosForm";

export const AppRouter = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePages />} />

        <Route path="/filmes" element={<FilmesList />} />
        <Route path="/filmes/novo" element={<FilmesForm />} />
        <Route path="/filmes/editar/:id" element={<FilmesForm />} />
        <Route path="/filmes/:id" element={<FilmesForm />} />

        <Route path="/salas" element={<SalasList />} />
        <Route path="/salas/novo" element={<SalasForm />} />
        <Route path="/salas/:id" element={<SalasForm />} />

        <Route path="/sessoes" element={<SessoesList />} />
        <Route path="/sessoes/novo" element={<SessoesForm />} />
        <Route path="/sessoes/:id" element={<SessoesForm />} />

        <Route path="/lanches" element={<LanchesList />} />
        <Route path="/lanches/novo" element={<LanchesForm />} />
        <Route path="/lanches/:id" element={<LanchesForm />} />

        <Route path="/ingressos/:sessaoId" element={<IngressosForm />} />
      </Routes>
    </>
  );
};
