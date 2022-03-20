import ParticlesBg from "particles-bg";
import styles from "./styles.module.scss";

export const Header = (props) => {
  return (
    <header id="header" className={styles.header}>
      <div className={styles.intro}>
        <ParticlesBg type="circle" bg={{zIndex: 0, position:"absolute", top:0}} />
        <div className={styles.overlay}>
          <div className='container'> 
            <div className='row'>
              <div className={`col-md-8 mx-auto ${styles.introText}`}>
                <h1>
                  {props.data ? props.data.title : 'Loading'}
                  <span></span>
                </h1>
                <p>{props.data ? props.data.paragraph : 'Loading'}</p>
                <a
                  href='#about'
                  className={`${styles.btn} ${styles.btnCustom} btn-lg page-scroll`}
                >
                  Learn More
                </a>{' '}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
