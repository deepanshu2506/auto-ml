import styles from "./styles.module.scss";
export const Features = (props) => {
  return (
    <div id="features" className={`${styles.features} text-center`}>
      <div className='container'>
        <div className={`${styles.sectionTitle} col-md-10 mx-auto`}>
          <h2>Features</h2>
        </div>
        <div className='row'>
          {props.data
            ? props.data.map((d, i) => (
                <div key={`${d.title}-${i}`} className='col-xs-6 col-md-3'>
                  {' '}
                  <i className={`${d.icon}`}></i>
                  <h3>{d.title}</h3>
                  <p>{d.text}</p>
                </div>
              ))
            : 'Loading...'}
        </div>
      </div>
    </div>
  )
}
