import React from 'react'
import styles from "./styles.module.scss";

export default function GlobalFilter ({filter,setFilter})  {
    return (
        <span className={styles.search}>
          Search  :{' '}
          <input value={filter || ''} onChange={e=> setFilter(e.target.value)}></input> 
        </span>
        
    )
}