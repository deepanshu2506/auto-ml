import styles from "./styles.module.scss";
export const Services = (props) => {
  return (
    <div id="services" className={`${styles.services} text-center`}>
      <div className='container'>
        <div className={`${styles.sectionTitle}`}>
          <h2>Our Services</h2>
          <p>
          One place for all your data operations.Now perform aggregation, imputation, visualization, model selection etc.hassle-free.
          </p>
        </div>
        <div className='row'>
          {props.data
            ? props.data.map((d, i) => (
                <div key={`${d.name}-${i}`} className='col-md-4'>
                  {' '}
                  <i className={d.icon}></i>
                  <div className={`${styles.serviceDesc}`}>
                    <h3>{d.name}</h3>
                    <p>{d.text}</p>
                  </div>
                </div>
              ))
            : 'loading'}
        </div>
      </div>
    </div>
  )
}
