import React from "react"
import { Link } from "react-router-dom"
import {
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink
} from 'reactstrap';


class Header extends React.Component {


    state = {
        isOpen: false
    };

    toggle = () => {
        this.setState({
            isOpen: !this.state.isOpen
        });
    }

    _handleLogout = () => {
        localStorage.removeItem("id-app")
        localStorage.removeItem("token-app")
    }

    render() {
        return (
            <div className='shadow-sm'>
                <Navbar color="dark" dark expand="md">
                    <NavbarBrand href="/">arduino controller</NavbarBrand>
                    <NavbarToggler onClick={this.toggle} />
                    <Collapse isOpen={this.state.isOpen} navbar>
                        {!this.props.isLogged ?
                            <Nav className="ml-auto" navbar>
                                <NavItem>
                                    <NavLink tag={Link} to="/register">Register</NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink tag={Link} to="/login">Login</NavLink>
                                </NavItem>
                            </Nav>
                            :
                            <Nav className="ml-auto" navbar>
                                <NavItem>
                                    <NavLink tag={Link} to="/home">Home</NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink tag={Link} to="/profile">Profile</NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink tag={Link} onClick={this._handleLogout} to="/">Log Out</NavLink>
                                </NavItem>
                            </Nav>
                        }
                    </Collapse>
                </Navbar>
            </div>
        );
    }
}

// return <header className="App-header bg-darkcyan">

//     <nav className="bar">
//         {/* <Link to="/">
//             <img src={homeicon} alt="home icon" width="100" />
//         </Link> */}
//         {!props.isLogged ?
//             <ul className="bar-ul ">
//                 <li className="bar-item">
//                     <Link className="bar-link" to="/login">Login</Link>
//                 </li>
//                 <li className="bar-item">
//                     <Link className="bar-link" to="/register">Register</Link>
//                 </li>
//             </ul>
//             :
//             <ul className="bar-ul">
//                 <li className="bar-item">
//                     <Link className="bar-link" to="/profile">Profile</Link>
//                 </li>
//                 <li className="bar-item">
//                     <Link className="bar-link" onClick={_handleLogout} to="/">Logout</Link>
//                 </li>
//                 <li className="bar-item">
//                     <Link className="bar-link" to="/home">Home</Link>
//                 </li>
//             </ul>
//         }
//     </nav>

// </header>

export default Header;