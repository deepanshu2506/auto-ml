import styles from "./styles.module.scss";
import { useSelector } from 'react-redux';

export const Navigation = (props) => {
  const { loggedIn } = useSelector(state => state.authentication);
  return (

    <div id="menu" className={`navbar navbar-expand-lg ${styles.menu} ${styles.navbarDefault} fixed-top`}>
      <nav className="navbar navbar-light ">
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-controls="bs-example-navbar-collapse-1" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
        <a className={`${styles.navbarBrand} page-scroll`} href='#header'>
          Data Genie
        </a>{' '}
      </nav>

      <div
        className='collapse navbar-collapse'
        id='bs-example-navbar-collapse-1'
      >
        <ul className={`${styles.navbarNav} navbar-nav ml-auto`}>
         
          <li>
            <a href='#services' className='page-scroll'>
              Services
            </a>
          </li>
          <li>
            <a href='#portfolio' className='page-scroll'>
              Sneak peek
            </a>
          </li>
          <li>
              <a href='#features' className='page-scroll'>
                Features
              </a>
            </li>
          <li>
            <a href='#about' className='page-scroll'>
              About
            </a>
          </li>
          {loggedIn ?
            <li>
              <a href='/datasets' >
                {/* <i className="fa fa-list"></i> */}
                List datasets
              </a>
            </li> : null}
          {!loggedIn ?
            <li>
              <a href='/login'>
                {/* <i className="fa fa-sign-in"></i> */}
                Login
              </a>
            </li> : null}
          {!loggedIn ? <li>
            <a href='/signup' >
              {/* <i className="fa fa-user-plus"></i> */}
              Signup
            </a>
          </li> : null}


        </ul>
      </div>
    </div >
  )
}
