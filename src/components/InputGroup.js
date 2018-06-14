import React from "react"

export default ({ children, values, onValues }) =>
  React.Children.map(children, child =>
    React.cloneElement(child, {
      ...child.props,
      value: values[child.props.name],
      update: value =>
        onValues({
          ...values,
          [child.props.name]: value
        })
    })
  )
