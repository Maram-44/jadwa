export default function IconDefinitions() {
  const bindings = {},
    slots = {},
    refs = {};
  return (
    <>
      <svg
        className={"all-icon-definitions"}
        aria-hidden={"true"}
        style={{
          position: "absolute",
          width: "0",
          height: "0",
          overflow: "hidden",
        }}
        {...bindings[".all-icon-definitions"]}
      >
        <defs>
          <symbol
            id={"home"}
            viewBox={"0 0 24 24"}
            {...bindings["home"]}
            ref={refs["home"]}
          >
            {Object.hasOwn(slots, "home") ? (
              slots["home"]
            ) : (
              <>
                <path d={"m3 10 9-7 9 7v10H3zM9 20v-7h6v7"} />
              </>
            )}
          </symbol>
          <symbol
            id={"spark"}
            viewBox={"0 0 24 24"}
            {...bindings["spark"]}
            ref={refs["spark"]}
          >
            {Object.hasOwn(slots, "spark") ? (
              slots["spark"]
            ) : (
              <>
                <path
                  d={
                    "m12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5zM20 3v4m-2-2h4"
                  }
                />
              </>
            )}
          </symbol>
          <symbol
            id={"box"}
            viewBox={"0 0 24 24"}
            {...bindings["box"]}
            ref={refs["box"]}
          >
            {Object.hasOwn(slots, "box") ? (
              slots["box"]
            ) : (
              <>
                <path
                  d={"m3 7 9-4 9 4v10l-9 4-9-4zM3 7l9 5 9-5M12 12v9M7 5l10 5"}
                />
              </>
            )}
          </symbol>
          <symbol
            id={"wallet"}
            viewBox={"0 0 24 24"}
            {...bindings["wallet"]}
            ref={refs["wallet"]}
          >
            {Object.hasOwn(slots, "wallet") ? (
              slots["wallet"]
            ) : (
              <>
                <rect x={"3"} y={"5"} width={"18"} height={"15"} rx={"3"} />
                <path d={"M3 9h18m-6 5h6M5 5V3h13"} />
              </>
            )}
          </symbol>
          <symbol
            id={"database"}
            viewBox={"0 0 24 24"}
            {...bindings["database"]}
            ref={refs["database"]}
          >
            {Object.hasOwn(slots, "database") ? (
              slots["database"]
            ) : (
              <>
                <ellipse cx={"12"} cy={"5"} rx={"8"} ry={"3"} />
                <path d={"M4 5v7c0 4 16 4 16 0V5M4 12v7c0 4 16 4 16 0v-7"} />
              </>
            )}
          </symbol>
          <symbol
            id={"video"}
            viewBox={"0 0 24 24"}
            {...bindings["video"]}
            ref={refs["video"]}
          >
            {Object.hasOwn(slots, "video") ? (
              slots["video"]
            ) : (
              <>
                <rect x={"3"} y={"6"} width={"12"} height={"12"} rx={"3"} />
                <path d={"m15 10 6-3v10l-6-3z"} />
              </>
            )}
          </symbol>
          <symbol
            id={"calendar"}
            viewBox={"0 0 24 24"}
            {...bindings["calendar"]}
            ref={refs["calendar"]}
          >
            {Object.hasOwn(slots, "calendar") ? (
              slots["calendar"]
            ) : (
              <>
                <rect x={"3"} y={"5"} width={"18"} height={"16"} rx={"3"} />
                <path d={"M7 3v5m10-5v5M3 11h18m-12 4h2m4 0h2"} />
              </>
            )}
          </symbol>
          <symbol
            id={"chart"}
            viewBox={"0 0 24 24"}
            {...bindings["chart"]}
            ref={refs["chart"]}
          >
            {Object.hasOwn(slots, "chart") ? (
              slots["chart"]
            ) : (
              <>
                <path d={"M5 20v-7m7 7V4m7 16V9"} />
              </>
            )}
          </symbol>
          <symbol
            id={"trend"}
            viewBox={"0 0 24 24"}
            {...bindings["trend"]}
            ref={refs["trend"]}
          >
            {Object.hasOwn(slots, "trend") ? (
              slots["trend"]
            ) : (
              <>
                <path d={"m3 17 6-6 4 4 8-10M15 5h6v6"} />
              </>
            )}
          </symbol>
          <symbol
            id={"tag"}
            viewBox={"0 0 24 24"}
            {...bindings["tag"]}
            ref={refs["tag"]}
          >
            {Object.hasOwn(slots, "tag") ? (
              slots["tag"]
            ) : (
              <>
                <path d={"M13 3h8v8L10 22 2 14z"} />
                <circle cx={"17"} cy={"7"} r={"1"} />
              </>
            )}
          </symbol>
          <symbol
            id={"file"}
            viewBox={"0 0 24 24"}
            {...bindings["file"]}
            ref={refs["file"]}
          >
            {Object.hasOwn(slots, "file") ? (
              slots["file"]
            ) : (
              <>
                <path d={"M5 3h9l5 5v13H5zM14 3v6h5M8 13h8m-8 4h6"} />
              </>
            )}
          </symbol>
          <symbol
            id={"chevron"}
            viewBox={"0 0 24 24"}
            {...bindings["chevron"]}
            ref={refs["chevron"]}
          >
            {Object.hasOwn(slots, "chevron") ? (
              slots["chevron"]
            ) : (
              <>
                <path d={"m8 10 4 4 4-4"} />
              </>
            )}
          </symbol>
          <symbol
            id={"check"}
            viewBox={"0 0 24 24"}
            {...bindings["check"]}
            ref={refs["check"]}
          >
            {Object.hasOwn(slots, "check") ? (
              slots["check"]
            ) : (
              <>
                <path d={"m5 12 4 4 10-10"} />
              </>
            )}
          </symbol>
          <symbol
            id={"close"}
            viewBox={"0 0 24 24"}
            {...bindings["close"]}
            ref={refs["close"]}
          >
            {Object.hasOwn(slots, "close") ? (
              slots["close"]
            ) : (
              <>
                <path d={"m6 6 12 12M6 18 18 6"} />
              </>
            )}
          </symbol>
          <symbol
            id={"menu"}
            viewBox={"0 0 24 24"}
            {...bindings["menu"]}
            ref={refs["menu"]}
          >
            {Object.hasOwn(slots, "menu") ? (
              slots["menu"]
            ) : (
              <>
                <path d={"M4 6h16M4 12h16M4 18h16"} />
              </>
            )}
          </symbol>
          <symbol
            id={"info"}
            viewBox={"0 0 24 24"}
            {...bindings["info"]}
            ref={refs["info"]}
          >
            {Object.hasOwn(slots, "info") ? (
              slots["info"]
            ) : (
              <>
                <circle cx={"12"} cy={"12"} r={"9"} />
                <path d={"M12 11v6m0-11v2"} />
              </>
            )}
          </symbol>
          <symbol
            id={"eye"}
            viewBox={"0 0 24 24"}
            {...bindings["eye"]}
            ref={refs["eye"]}
          >
            {Object.hasOwn(slots, "eye") ? (
              slots["eye"]
            ) : (
              <>
                <path d={"M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"} />
                <circle cx={"12"} cy={"12"} r={"3"} />
              </>
            )}
          </symbol>
          <symbol
            id={"guest"}
            viewBox={"0 0 24 24"}
            {...bindings["guest"]}
            ref={refs["guest"]}
          >
            {Object.hasOwn(slots, "guest") ? (
              slots["guest"]
            ) : (
              <>
                <circle cx={"12"} cy={"8"} r={"4"} />
                <path d={"M4 21v-2a8 8 0 0 1 16 0v2"} />
              </>
            )}
          </symbol>
          <symbol
            id={"logout"}
            viewBox={"0 0 24 24"}
            {...bindings["logout"]}
            ref={refs["logout"]}
          >
            {Object.hasOwn(slots, "logout") ? (
              slots["logout"]
            ) : (
              <>
                <path d={"M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"} />
              </>
            )}
          </symbol>
        </defs>
      </svg>
    </>
  );
}
