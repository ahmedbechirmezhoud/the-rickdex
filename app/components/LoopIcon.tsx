import Svg, { G, Path, Defs, ClipPath, Rect } from "react-native-svg"

type SearchIconProps = {
  size?: number
  color?: string
  style?: any
}

function SearchIcon({ size = 14, color = "white", style }: SearchIconProps) {
  const strokeWidth = (2 / 14) * size

  return (
    <Svg width={size} height={size} viewBox="0 0 14 14" fill="none" style={style}>
      <G clipPath="url(#clip0_32_714)">
        <Path
          d="M6.04543 1.75C5.19588 1.75 4.3654 2.00192 3.65902 2.47391C2.95264 2.9459 2.40208 3.61675 2.07697 4.40164C1.75186 5.18653 1.6668 6.05019 1.83254 6.88343C1.99828 7.71666 2.40738 8.48203 3.0081 9.08276C3.60883 9.68348 4.3742 10.0926 5.20743 10.2583C6.04067 10.4241 6.90433 10.339 7.68922 10.0139C8.47411 9.68878 9.14496 9.13822 9.61695 8.43184C10.0889 7.72546 10.3409 6.89498 10.3409 6.04543C10.3408 4.90623 9.88821 3.81372 9.08268 3.00818C8.27714 2.20265 7.18463 1.75007 6.04543 1.75Z"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeMiterlimit={10}
        />
        <Path
          d="M9.25012 9.25012L12.25 12.25"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeMiterlimit={10}
          strokeLinecap="round"
        />
      </G>

      <Defs>
        <ClipPath id="clip0_32_714">
          <Rect width="14" height="14" fill="white" />
        </ClipPath>
      </Defs>
    </Svg>
  )
}

export default SearchIcon
