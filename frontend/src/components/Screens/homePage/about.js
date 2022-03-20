import styles from "./styles.module.scss";

import LottieAnimation from '../../../Lottie';
import about from '../../../Animation/about.json';

export const About = (props) => {
  if (!props.data) return null;

    const networks = props.data.social.map(function (network) {
      return (
        <li key={network.name}>
          <a href={network.url}>
            <i className={network.className}></i>
          </a>
        </li>
      );
    });
  return (
    <div className={`${styles.about}`} id="about">
      <div className='container'>
        <div className='row'>
          <div className='col-xs-12 col-md-6'>
            {' '}
            {/* <img src='img/about.jpg' className='img-responsive' alt='' />{' '} */}
            <LottieAnimation lotti={about} height={100} width={100} />
          </div>
          <div className='col-xs-12 col-md-6'>
            <div className={`${styles.aboutText}`}>
              <h2>About Us</h2>
              <p>{props.data ? props.data.paragraph : 'loading...'}</p>
              <h6>Mail us your queries : datagenie@gmail.com</h6>
              <div className="row">
              <div className={styles.twelveColumns}>
              <ul className={styles.socialLinks}>{networks}</ul>
              <ul className="copyright">
                <li>&copy; Copyright 2022 Hiral Sakshi Parth Deepanshu</li>
              </ul>
            </div>
            </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
