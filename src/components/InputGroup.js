import React from "react"

export default ({ children, values, onValues }) =>
  React.Children.map(children, child =>
    React.cloneElement(child, {
      ...child.props,
      isActive: values.isActive,
      value: values[child.props.name],
      updateChecked: value =>
        onValues({
          ...values,
          [child.props.name]: !value
        }),
      update: value =>
        onValues({
          ...values,
          [child.props.name]: value
        })
    })
  )
