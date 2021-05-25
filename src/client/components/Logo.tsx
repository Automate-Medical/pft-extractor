interface LogoSize {
  small?: boolean
}

const Logo = (props: React.HTMLAttributes<HTMLElement> & LogoSize) => {
  let width = 262;
  let height = 44.5;

  if (props.small) {
    width = width * 0.75;
    height = height * 0.75;
  }

  return (
    <img src="/logo-@2x.png"
      className={props.className}
      width={width}
      height={height}
      alt="PFT Tutorbot by Automate Medical"
    />
  )
}

export default Logo;