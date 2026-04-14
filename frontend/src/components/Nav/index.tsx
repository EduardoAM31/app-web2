import { Link } from "react-router-dom";

export const Nav = () => {
    return (
        <>
            <div className="d-flex justify-content-center align-items-center bg-dark p-3 mb-3 text-white">
                <ul className="nav">
                
                    <li className="nav-item">
                        <Link className="nav-link text-white" to="/">Home</Link>
                    </li>

                    <li className="nav-item">
                        <Link className="nav-link text-white" to="/filmes">Filmes</Link>
                    </li>

                    <li className="nav-item">
                        <Link className="nav-link text-white" to="/salas">Salas</Link>
                    </li>

                    <li className="nav-item">
                        <Link className="nav-link text-white" to="/sessoes">Sessões</Link>
                    </li>

                    <li className="nav-item">
                        <Link className="nav-link text-white" to="/lanches">Lanches</Link>
                    </li>

                </ul>
            </div>
        </>
    );
}
