import type { FC } from "react";
type Props = {
  className: string;
};
const Logo: FC<Props> = ({ className }) => (
  <svg
    viewBox="0 0 39 38"
    xmlns="http://www.w3.org/2000/svg"
    xmlSpace="preserve"
    className={className}
    style={{
      fillRule: "evenodd",
      clipRule: "evenodd",
      strokeLinejoin: "round",
      strokeMiterlimit: 2,
    }}
  >
    <g transform="translate(.938 -.086) scale(1.01862)">
      <path
        style={{
          fill: "none",
        }}
        d="M.016.085h37.305V37.39H.016z"
      />
      <clipPath id="a">
        <path d="M.016.085h37.305V37.39H.016z" />
      </clipPath>
      <g clipPath="url(#a)">
        <path
          d="M180.636 136.11c0-6.496-5.275-11.771-11.771-11.771h-23.543c-6.496 0-11.771 5.275-11.771 11.771v23.543c0 6.496 5.275 11.771 11.771 11.771h23.543c6.496 0 11.771-5.275 11.771-11.771V136.11Z"
          style={{
            fill: "#fe5537",
          }}
          transform="matrix(.7923 0 0 .7923 -105.875 -98.43)"
        />
        <text
          x={72.181}
          y={151.448}
          style={{
            fontFamily: "'SavoyeLetPlain','Savoye LET'",
            fontSize: 30,
            fill: "#fdebdd",
          }}
          transform="matrix(2.78746 0 0 2.93002 -193.838 -412.562)"
        >
          {"n"}
        </text>
        <path
          d="m16.725 13.926-.949 1.493 18.491.123a.75.75 0 0 0 .01-1.5l-17.552-.116ZM12.516 13.898l-8.181-.054a.75.75 0 0 0-.01 1.5l7.732.051.459-1.497Z"
          style={{
            fill: "#fdebdd",
          }}
          transform="matrix(.98171 0 0 .98171 -.09 .085)"
        />
        <path
          d="m4.325 15.344 29.942.198a.75.75 0 0 0 .01-1.5l-29.942-.198a.75.75 0 0 0-.01 1.5Z"
          style={{
            fill: "#fdebdd",
          }}
          transform="matrix(.98171 0 0 .98171 -1.045 8.018)"
        />
      </g>
    </g>
  </svg>
);

export default Logo;
