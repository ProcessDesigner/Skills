import React, { useState, useRef, useEffect } from "react"

const Popover = ({ children }) => {
  return <>{children}</>
}

const PopoverTrigger = ({ children, ...props }) => {
  return React.cloneElement(children, props)
}

const PopoverContent = ({ children, className = "", ...props }) => {
  const [isVisible, setIsVisible] = useState(false)
  const popoverRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target)) {
        setIsVisible(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <div ref={popoverRef} className="relative">
      {React.cloneElement(React.Children.only(children), {
        onClick: () => setIsVisible(!isVisible),
        ...props,
      })}
      {isVisible && (
        <div className={`absolute z-50 mt-2 ${className}`}>
          {typeof children === "function" ? children({ close: () => setIsVisible(false) }) : children}
        </div>
      )}
    </div>
  )
}

export { Popover, PopoverTrigger, PopoverContent }

