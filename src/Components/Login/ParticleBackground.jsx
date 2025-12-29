// import React from 'react';
// import useParticles from '../../Hooks/UseParticles';

// const ParticleBackground = () => {
//   const { canvasRef, handleClick } = useParticles();

//   return (
//     <canvas
//       ref={canvasRef}
//       onClick={handleClick}
//       style={{
//         position: 'fixed',
//         top: 0,
//         left: 0,
//         width: '100%',
//         height: '100%',
//         zIndex: 1,
//       }}
//     />
//   );
// };

// export default ParticleBackground;

import React from 'react';
import useParticles from '../../Hooks/UseParticles';

const ParticleBackground = () => {
  const { canvasRef, handleClick } = useParticles();

  return (
    <canvas
      ref={canvasRef}
      onClick={handleClick}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 1,
      }}
      aria-label="Elegant particle background animation"
    />
  );
};

export default ParticleBackground;