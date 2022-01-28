export const sizes = {
  mobile: 640,
  tablet: 940,
  smallLaptop: 1200,
  laptop: 1440,
  laptopMedium: 1600,
  largeLaptop: 1800,
  desktop: 1920,
  largeDesktop: 2560,
}

export const isMobile = () => window.innerWidth <= sizes.mobile
export const isLaptop = () => window.innerWidth <= sizes.laptop
export const isSize = (key) => window.innerWidth <= sizes[key]

export const mobile = () => `@media (max-width: ${sizes.mobile}px)`
export const tablet = () => `@media (max-width: ${sizes.tablet}px)`
export const smallLaptop = () => `@media (max-width: ${sizes.smallLaptop}px)`
export const laptop = () => `@media (max-width: ${sizes.laptop}px)`
export const laptopMedium = () => `@media (max-width: ${sizes.laptopMedium}px)`
export const largeLaptop = () => `@media (max-width: ${sizes.largeLaptop}px)`
export const desktop = () => `@media (max-width: ${sizes.desktop}px)`
export const largeDesktop = () => `@media (max-width: ${sizes.largeDesktop}px)`
export const middleContent = ({ padding = true } = {}) => `
  margin: 0 auto;
  width: 100%;
  padding: 0 21%;
  ${desktop()} {
    padding: 0 17.1%;
  }
  ${laptop()} {
    padding: 0 11.4%;
  }
  ${tablet()} {
    padding: 0 5%;
  }
  ${mobile()} {
    width: 100%;
    ${padding && 'padding: 1em;'} 
  }
`
