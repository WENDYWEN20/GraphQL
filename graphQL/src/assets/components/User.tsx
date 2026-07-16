import React from 'react'
import "../../App.css";
export default function User({user}) {
    const {id, name,age, isMarried} =user
  return (
    <div key ={id}>
      <li>Name: {name}</li>
      <li>Age: {age}</li>
      <li>Married: {isMarried? 'Yse': 'No'}</li>
      <button>Edit</button>
      <hr className='break'/>
    </div>
  )
}
