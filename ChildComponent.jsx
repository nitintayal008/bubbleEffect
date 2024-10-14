import React, { forwardRef } from "react";

const ChildComponent = forwardRef(({ data, setClick }, ref) => {
  return (
    <div ref={ref} className="childComponent" onClick={() => setClick(data)}>
      {React.cloneElement(data, { className: 'childImage' })} {/* Clone image element with specific class */}
    </div>
  );
});

export default ChildComponent;
