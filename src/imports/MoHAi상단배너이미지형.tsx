import svgPaths from "./svg-yrqvy3o21l";
const imgName = "http://localhost:3845/assets/7199c222bacc62e58687b81f2cfc6df8209755a9.png";
const imgImage104 = "http://localhost:3845/assets/4a22a46ee391230ab27877c18d821521d6daf355.png";
import { imgImage103 } from "./svg-6t475";

function Time() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative" data-name="Time">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center pr-[4px] relative w-full">
          <p className="font-['SF_Pro:Semibold',sans-serif] font-[590] leading-[22px] relative shrink-0 text-[16px] text-black text-center" style={{ fontVariationSettings: "'wdth' 100" }}>
            9:41
          </p>
        </div>
      </div>
    </div>
  );
}

function DynamicIslandSpacer() {
  return <div className="h-[10px] shrink-0 w-[124px]" data-name="Dynamic Island spacer" />;
}

function Battery() {
  return (
    <div className="h-[13px] relative shrink-0 w-[27.328px]" data-name="Battery">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 27.328 13">
        <g id="Battery">
          <rect height="12" id="Border" opacity="0.35" rx="3.8" stroke="var(--stroke-0, black)" width="24" x="0.5" y="0.5" />
          <path d={svgPaths.p3bbd9700} fill="var(--fill-0, black)" id="Cap" opacity="0.4" />
          <rect fill="var(--fill-0, black)" height="9" id="Capacity" rx="2.5" width="21" x="2" y="2" />
        </g>
      </svg>
    </div>
  );
}

function Levels() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative" data-name="Levels">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex gap-[7px] items-center justify-center pr-[10px] relative w-full">
          <div className="h-[12.226px] relative shrink-0 w-[19.2px]" data-name="Cellular Connection">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 19.2 12.2264">
              <path clipRule="evenodd" d={svgPaths.p1e09e400} fill="var(--fill-0, black)" fillRule="evenodd" id="Cellular Connection" />
            </svg>
          </div>
          <div className="h-[12.328px] relative shrink-0 w-[17.142px]" data-name="Wifi">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 17.1417 12.3283">
              <path clipRule="evenodd" d={svgPaths.p18b35300} fill="var(--fill-0, black)" fillRule="evenodd" id="Wifi" />
            </svg>
          </div>
          <Battery />
        </div>
      </div>
    </div>
  );
}

function Frame() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="Frame">
      <Time />
      <DynamicIslandSpacer />
      <Levels />
    </div>
  );
}

function StatusBarIPhone() {
  return (
    <div className="absolute bg-white content-stretch flex flex-col h-[48px] items-start left-0 pt-[12px] top-0 w-[360px]" data-name="Status Bar - iPhone">
      <Frame />
    </div>
  );
}

function CompHomebarIos() {
  return (
    <div className="absolute inset-[95.64%_0_0_0]" data-name="comp_homebar_ios">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 360 34">
        <g id="comp_homebar_ios">
          <path d="M360 0H5.7444e-05V34H360V0Z" fill="var(--fill-0, white)" id="box_32px" />
          <path d={svgPaths.p35c05170} fill="var(--fill-0, black)" id="ì¬ê°í 1" />
        </g>
      </svg>
    </div>
  );
}

function Group14() {
  return (
    <div className="absolute contents inset-[95.64%_0_0_0]">
      <CompHomebarIos />
    </div>
  );
}

function Group() {
  return (
    <div className="absolute inset-[8.69%_57.13%_89.17%_38.24%]">
      <div className="absolute inset-[-2.99%_-3%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 17.6667 17.6984">
          <g id="Group 43">
            <path d={svgPaths.p12882400} id="íì 2070" stroke="var(--stroke-0, #CCCCCC)" />
            <path d={svgPaths.p109dbd80} fill="var(--fill-0, #666666)" id="í¨ì¤ 18215" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function Group1() {
  return (
    <div className="absolute contents left-[136px] top-[66px]">
      <Group />
      <div className="absolute left-[136px] size-[20px] top-[66px]" />
    </div>
  );
}

function Group2() {
  return (
    <div className="absolute contents left-[52px] top-[58px]">
      <p className="-translate-x-1/2 absolute font-['Pretendard:Bold',sans-serif] leading-[36px] left-[92px] not-italic text-[#111] text-[20px] text-center top-[58px] tracking-[-0.4px]">H-AI 하이</p>
      <Group1 />
    </div>
  );
}

function Group3() {
  return (
    <div className="absolute contents left-[52px] top-[58px]">
      <Group2 />
    </div>
  );
}

function IcArrowLeft() {
  return (
    <div className="absolute inset-[8.22%_87.78%_88.7%_5.56%]" data-name="ic-arrow-left">
      <div className="-translate-y-1/2 absolute aspect-[43/40] left-[4.17%] right-[6.25%] top-[calc(50%-0.02px)]" data-name="Union">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 21.5 20">
          <path d={svgPaths.p289d50b0} fill="var(--fill-0, #111111)" id="Union" />
        </svg>
      </div>
    </div>
  );
}

function Group9() {
  return (
    <div className="absolute contents left-[20px] top-[58px]">
      <Group3 />
      <IcArrowLeft />
    </div>
  );
}

function Header() {
  return (
    <div className="absolute contents left-0 top-[48px]" data-name="header">
      <div className="absolute bg-white h-[56px] left-0 top-[48px] w-[360px]" />
      <Group9 />
    </div>
  );
}

function Group10() {
  return (
    <div className="absolute contents left-[56px] top-[204px]">
      <div className="absolute h-[16px] left-[56px] top-[204px] w-[24.774px]" data-name="name">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgName} />
      </div>
    </div>
  );
}

function Group12() {
  return (
    <div className="absolute contents font-['pretendard:Regular',sans-serif] left-[36px] not-italic text-[#111] top-[242px]">
      <p className="absolute leading-[0] left-[36px] text-[0px] top-[242px] tracking-[-0.3px]">
        <span className="leading-[1.5] text-[14px] tracking-[-0.28px]">{`안녕하세요. `}</span>
        <span className="font-['pretendard:Bold',sans-serif] leading-[1.5] text-[14px] tracking-[-0.28px]">H-AI (하이)</span>
        <span className="leading-[1.5] text-[15px]">{` `}</span>
        <span className="leading-[1.5] text-[14px] tracking-[-0.28px]">입니다.</span>
      </p>
      <div className="absolute leading-[1.5] left-[36px] text-[14px] top-[273px] tracking-[-0.28px] whitespace-nowrap">
        <p className="mb-0">여행 일정과 정보를 물어보시거나,</p>
        <p>궁금하신 점을 입력창에 입력해 주세요.</p>
      </div>
    </div>
  );
}

function IcSound() {
  return (
    <div className="absolute inset-[0_0_0_0.32%]" data-name="ic_sound">
      <div className="absolute inset-[0_0_0_-0.02%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15.9528 16">
          <g id="ic_sound">
            <path d={svgPaths.p30ede500} fill="var(--fill-0, white)" id="ì¬ê°í 22884" opacity="0" />
            <g id="ê·¸ë£¹ 78021">
              <path d={svgPaths.p495ae00} fill="var(--fill-0, white)" id="ì¬ê°í 38431" opacity="0" />
              <g id="ê·¸ë£¹ 78020">
                <path d={svgPaths.p166d6d80} id="í¨ì¤ 27286" stroke="var(--stroke-0, #666666)" strokeLinecap="round" strokeLinejoin="round" />
                <path d={svgPaths.p17eb36c0} id="í¨ì¤ 27287" stroke="var(--stroke-0, #666666)" strokeLinecap="round" strokeLinejoin="round" />
                <path d={svgPaths.p31d85500} id="í¨ì¤ 27295" stroke="var(--stroke-0, #666666)" strokeMiterlimit="10" />
              </g>
            </g>
          </g>
        </svg>
      </div>
    </div>
  );
}

function Frame1() {
  return (
    <div className="absolute left-[32px] overflow-clip size-[16px] top-[339px]" data-name="Frame">
      <IcSound />
    </div>
  );
}

function Group11() {
  return (
    <div className="absolute contents left-[32px] top-[339px]">
      <p className="-translate-x-1/2 absolute font-['pretendard:Regular',sans-serif] leading-[1.4] left-[71px] not-italic text-[#111] text-[12px] text-center top-[339px]">음성안내</p>
      <Frame1 />
    </div>
  );
}

function Group8() {
  return (
    <div className="absolute contents left-[32px] top-[339px]">
      <Group11 />
    </div>
  );
}

function Group15() {
  return (
    <div className="absolute contents left-[32px] top-[339px]">
      <Group8 />
    </div>
  );
}

function IcCopy() {
  return (
    <div className="absolute inset-[43.46%_66.67%_54.49%_28.89%]" data-name="ic_copy">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="ic_copy">
          <g id="Rectangle 5727" />
          <path d={svgPaths.p370a2100} id="union-1" stroke="var(--stroke-0, #666666)" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </svg>
    </div>
  );
}

function Group16() {
  return (
    <div className="absolute contents left-[104px] top-[339px]">
      <IcCopy />
      <p className="absolute font-['pretendard:Regular',sans-serif] leading-[1.4] left-[123px] not-italic text-[#111] text-[12px] top-[339px]">복사</p>
    </div>
  );
}

function Group19() {
  return (
    <div className="absolute contents left-[32px] top-[339px]">
      <Group15 />
      <Group16 />
    </div>
  );
}

function Component2() {
  return (
    <div className="absolute inset-[42.56%_33.33%_53.59%_58.33%]" data-name="타원 2210">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 30 30.0001">
        <g id="íì 2210">
          <path d={svgPaths.p16726600} fill="var(--fill-0, #FAFAFA)" id="Vector" />
          <path d={svgPaths.p30671e80} id="Vector_2" stroke="var(--stroke-0, #E5E5E5)" />
        </g>
      </svg>
    </div>
  );
}

function Bad() {
  return (
    <div className="absolute inset-[43.46%_35.28%_54.49%_60.28%]" data-name="bad">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="bad">
          <g id="32bg" />
          <g id="shape">
            <g id="guide" opacity="0">
              <g id="Vector" />
              <path d={svgPaths.p2186c100} id="Vector_2" stroke="var(--stroke-0, #111111)" />
            </g>
            <path d={svgPaths.peee6900} id="í¨ì¤ 23485" stroke="var(--stroke-0, #666666)" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M5.03656 8.58574V1.56474" id="í¨ì¤ 25256" stroke="var(--stroke-0, #666666)" strokeLinecap="round" />
          </g>
        </g>
      </svg>
    </div>
  );
}

function IconBadOff() {
  return (
    <div className="absolute contents inset-[42.56%_33.33%_53.59%_58.33%]" data-name="icon_bad_off">
      <Component2 />
      <Bad />
    </div>
  );
}

function Component1() {
  return (
    <div className="absolute inset-[42.56%_43.89%_53.59%_47.78%]" data-name="타원 2209">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 30 30">
        <g id="íì 2209">
          <path d={svgPaths.p7c58b00} fill="var(--fill-0, #FAFAFA)" id="Vector" />
          <path d={svgPaths.p28e4e700} id="Vector_2" stroke="var(--stroke-0, #E5E5E5)" />
        </g>
      </svg>
    </div>
  );
}

function Good() {
  return (
    <div className="absolute inset-[43.46%_45.83%_54.49%_49.72%]" data-name="good">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="good">
          <g id="32bg" />
          <g id="shape">
            <g id="guide" opacity="0">
              <g id="Vector" />
              <path d={svgPaths.p2a082880} id="Vector_2" stroke="var(--stroke-0, #111111)" />
            </g>
            <path d={svgPaths.p305d3d00} id="í¨ì¤ 23485" stroke="var(--stroke-0, #666666)" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M5.11749 7.56836V14.6979" id="í¨ì¤ 25256" stroke="var(--stroke-0, #666666)" strokeLinecap="round" />
          </g>
        </g>
      </svg>
    </div>
  );
}

function IconGoodOff() {
  return (
    <div className="absolute contents inset-[42.56%_43.89%_53.59%_47.78%]" data-name="icon_good_off">
      <Component1 />
      <Good />
    </div>
  );
}

function Component3() {
  return (
    <div className="absolute inset-[42.56%_22.78%_53.59%_68.89%]" data-name="타원 2210">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 30 30.0001">
        <g id="íì 2210">
          <path d={svgPaths.p16726600} fill="var(--fill-0, #FAFAFA)" id="Vector" />
          <path d={svgPaths.p30671e80} id="Vector_2" stroke="var(--stroke-0, #E5E5E5)" />
        </g>
      </svg>
    </div>
  );
}

function Group13() {
  return (
    <div className="absolute inset-[43.56%_25.06%_54.61%_71.22%]">
      <div className="absolute inset-[-3.52%_-3.74%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14.3713 15.2072">
          <g id="Group 26984">
            <path d={svgPaths.p11918900} id="í¨ì¤ 25288" stroke="var(--stroke-0, #666666)" strokeLinecap="round" />
            <path d="M0.5 14.7072H13.8713" id="ì  373" stroke="var(--stroke-0, #666666)" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M7.18568 0.5V1.89301" id="ì  374" stroke="var(--stroke-0, #666666)" strokeLinecap="round" strokeLinejoin="round" />
            <path d={svgPaths.p1fbe8100} id="ì  752" stroke="var(--stroke-0, #666666)" strokeLinecap="round" strokeLinejoin="round" />
            <path d={svgPaths.p17a9ef18} id="ì  753" stroke="var(--stroke-0, #666666)" strokeLinecap="round" strokeLinejoin="round" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function IcComplain() {
  return (
    <div className="absolute contents left-[255px] top-[339px]" data-name="ic_complain">
      <div className="absolute left-[255px] size-[16px] top-[339px]" />
      <Group13 />
    </div>
  );
}

function Group17() {
  return (
    <div className="absolute contents left-[248px] top-[332px]">
      <Component3 />
      <IcComplain />
    </div>
  );
}

function Group18() {
  return (
    <div className="absolute contents left-[172px] top-[332px]">
      <IconBadOff />
      <IconGoodOff />
      <Group17 />
    </div>
  );
}

function Group20() {
  return (
    <div className="absolute contents left-[32px] top-[332px]">
      <Group19 />
      <Group18 />
    </div>
  );
}

function Group4() {
  return (
    <div className="absolute contents left-0 top-[671px]">
      <div className="absolute bg-[#f5f5f5] h-[0.987px] left-0 top-[671px] w-[360px]" />
      <div className="absolute bg-white h-[75.013px] left-0 top-[671.99px] w-[360px]" />
    </div>
  );
}

function Frame2() {
  return (
    <div className="absolute left-[28px] overflow-clip size-[16px] top-[688px]" data-name="Frame">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="delete">
          <g id="32bg" />
          <g id="delete_2">
            <g id="guide" />
            <g id="delete_3">
              <path d="M1.98628 4.64044H13.8623" id="í¨ì¤ 16222" stroke="var(--stroke-0, #666666)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
              <path d={svgPaths.p8d89080} id="í¨ì¤ 16223" stroke="var(--stroke-0, #666666)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
              <path d="M6.44 8.10352V10.5778" id="í¨ì¤ 16224" stroke="var(--stroke-0, #666666)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
              <path d="M9.40857 8.10352V10.5778" id="í¨ì¤ 16225" stroke="var(--stroke-0, #666666)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            </g>
          </g>
        </g>
      </svg>
    </div>
  );
}

function Group23() {
  return (
    <div className="absolute contents left-[20px] top-[680px]">
      <div className="absolute left-[20px] size-[32px] top-[680px]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
          <circle cx="16" cy="16" fill="var(--fill-0, white)" id="Ellipse 1796" r="15.5" stroke="var(--stroke-0, #E5E5E5)" />
        </svg>
      </div>
      <Frame2 />
    </div>
  );
}

function Group25() {
  return (
    <div className="absolute contents left-[20px] top-[680px]">
      <p className="absolute font-['Pretendard:SemiBold',sans-serif] leading-[18px] left-[20px] not-italic text-[#aaa] text-[9px] top-[712px]">채팅삭제</p>
      <Group23 />
    </div>
  );
}

function Group24() {
  return (
    <div className="absolute contents left-[20px] top-[680px]">
      <Group25 />
    </div>
  );
}

function Group5() {
  return (
    <div className="absolute contents left-[20px] top-[680px]">
      <Group24 />
    </div>
  );
}

function Group21() {
  return (
    <div className="absolute left-[306.8px] size-[15px] top-[696.5px]">
      <div className="absolute inset-[-8%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 17.4 17.4">
          <g id="Group 1261153099">
            <path d="M1.2 6.2L1.2 11.2" id="Vector 34" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeWidth="2.4" />
            <path d="M16.2 7.2L16.2 10.2" id="Vector 37" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeWidth="2.4" />
            <path d="M11.2 4.2L11.2 13.2" id="Vector 36" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeWidth="2.4" />
            <path d="M6.2 1.2L6.2 16.2" id="Vector 35" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeWidth="2.4" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function IcLiveButton() {
  return (
    <div className="absolute contents left-[304px] top-[694px]" data-name="ic_live_button">
      <div className="absolute bg-[rgba(217,217,217,0)] left-[304px] size-[20px] top-[694px]" />
      <Group21 />
    </div>
  );
}

function Group27() {
  return (
    <div className="absolute contents left-[298px] top-[688px]">
      <div className="absolute left-[298px] size-[32px] top-[688px]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
          <circle cx="16" cy="16" fill="var(--fill-0, #111111)" id="Ellipse 1795" r="16" />
        </svg>
      </div>
      <IcLiveButton />
    </div>
  );
}

function Group6() {
  return (
    <div className="absolute contents left-[60px] top-[678px]">
      <div className="absolute bg-[#f5f5f5] h-[52px] left-[60px] rounded-[300px] top-[678px] w-[280px]" />
      <Group27 />
      <p className="absolute font-['Pretendard:Medium',sans-serif] leading-[18px] left-[76px] not-italic text-[#aaa] text-[14px] top-[695px]">궁금하신 내용을 물어보세요!</p>
    </div>
  );
}

function Group7() {
  return (
    <div className="absolute contents left-[20px] top-[678px]">
      <Group5 />
      <Group6 />
    </div>
  );
}

function Input() {
  return (
    <div className="absolute contents left-0 top-[671px]" data-name="input">
      <Group4 />
      <Group7 />
    </div>
  );
}

function Frame3() {
  return (
    <div className="absolute left-[262px] overflow-clip size-[28px] top-[690px]" data-name="Frame">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 28 28">
        <g id="icon_voice_off">
          <path d="M28 0H0V28H28V0Z" fill="var(--fill-0, white)" id="ì¬ê°í 37874" opacity="0" />
          <g id="ê·¸ë£¹ 73499">
            <path d={svgPaths.p11ae6500} fill="var(--fill-0, white)" id="ì¬ê°í 22896" opacity="0" />
            <g id="ê·¸ë£¹ 73456">
              <path d={svgPaths.p2e50d400} id="ì¬ê°í 22892" stroke="var(--stroke-0, #666666)" strokeMiterlimit="10" strokeWidth="2" />
              <path d={svgPaths.pa528480} id="í¨ì¤ 27292" stroke="var(--stroke-0, #666666)" strokeLinecap="round" strokeMiterlimit="10" strokeWidth="2" />
              <path d="M14 20.125V22.75" id="ì  9366" stroke="var(--stroke-0, #666666)" strokeLinecap="round" strokeMiterlimit="10" strokeWidth="2" />
            </g>
          </g>
        </g>
      </svg>
    </div>
  );
}

function Group22() {
  return (
    <div className="absolute h-[16.25px] left-[312.5px] opacity-90 top-[733.88px] w-[15px]">
      <div className="absolute inset-[-7.38%_-8%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 17.4 18.65">
          <g id="Group 1261153099">
            <path d="M1.2 5.575L1.2 11.825" id="Vector 34" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeWidth="2.4" />
            <path d="M16.2 6.825L16.2 11.825" id="Vector 37" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeWidth="2.4" />
            <path d="M11.2 3.075L11.2 14.325" id="Vector 36" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeWidth="2.4" />
            <path d="M6.2 1.2L6.2 17.45" id="Vector 35" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeWidth="2.4" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function IcLive() {
  return (
    <div className="absolute contents left-[310px] top-[732px]" data-name="ic_live">
      <div className="absolute left-[310px] opacity-90 size-[20px] top-[732px]" />
      <Group22 />
    </div>
  );
}

function Group26() {
  return (
    <div className="absolute contents left-0 top-[671px]">
      <Input />
      <Frame3 />
      <IcLive />
    </div>
  );
}

function Component() {
  return (
    <div className="absolute inset-[19.15%_16.95%_12.5%_10.39%]" data-name="손">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20.3436 19.1372">
        <g id="ì">
          <g id="Group">
            <path d={svgPaths.p3b265900} fill="var(--fill-0, white)" id="ì  9917 (Stroke)" />
            <path d={svgPaths.pf698a00} fill="var(--fill-0, white)" id="ì  9918 (Stroke)" />
            <path d={svgPaths.p2f04faf0} fill="var(--fill-0, white)" id="ì  9919 (Stroke)" />
            <path d={svgPaths.pc679080} fill="var(--fill-0, white)" id="ì  9920 (Stroke)" />
            <path d={svgPaths.p35336300} fill="var(--fill-0, white)" id="ì  9921 (Stroke)" />
          </g>
          <path d={svgPaths.p8628770} fill="var(--fill-0, white)" id="í¨ì¤ 48564 (Stroke)" />
        </g>
      </svg>
    </div>
  );
}

function HAiLogo() {
  return (
    <div className="-translate-x-1/2 absolute left-[calc(50%-146px)] overflow-clip size-[28px] top-[198px]" data-name="H-AI_logo">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 28 28">
        <g id="BG">
          <path d={svgPaths.pc390800} fill="url(#paint0_linear_1_257)" id="bg-2" />
        </g>
        <defs>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_1_257" x1="-4.69333" x2="35.3467" y1="23.0867" y2="3.48667">
            <stop stopColor="#73EEFF" />
            <stop offset="1" stopColor="#1E52FF" />
          </linearGradient>
        </defs>
      </svg>
      <Component />
    </div>
  );
}

function MaskGroup() {
  return (
    <div className="absolute contents left-[231px] top-0" data-name="Mask group">
      <div className="absolute h-[72px] left-[235px] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-4px_-1px] mask-size-[89px_74px] top-px w-[81px]" data-name="image 103" style={{ maskImage: `url('${imgImage103}')` }}>
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <img alt="" className="absolute h-[168.68%] left-0 max-w-none top-[-30.25%] w-full" src={imgImage104} />
        </div>
      </div>
    </div>
  );
}

function Frame4() {
  return (
    <div className="absolute bg-[#dbf9ff] h-[74px] left-[20px] rounded-[12px] top-[112px] w-[320px]">
      <p className="absolute font-['pretendard:Semibold',sans-serif] leading-[1.5] left-[20px] not-italic text-[#3780ff] text-[14px] top-[17px] tracking-[-0.28px]">H-AI와 함께한 100만 번의 특별한 순간</p>
      <p className="absolute font-['pretendard:Regular',sans-serif] leading-[1.4] left-[20px] not-italic text-[#61757e] text-[12px] top-[40px] w-[210px] whitespace-pre-wrap">여러분과 함께한 발자취를 확인해 보세요!</p>
      <MaskGroup />
    </div>
  );
}

export default function MoHAi() {
  return (
    <div className="bg-white relative size-full" data-name="MO_H-AI_상단 배너 이미지형">
      <StatusBarIPhone />
      <Group14 />
      <Header />
      <Group10 />
      <div className="absolute bg-[#f2f2f2] h-[139px] left-[20px] rounded-bl-[24px] rounded-br-[24px] rounded-tr-[24px] top-[230px] w-[270px]" />
      <Group12 />
      <div className="absolute bg-[rgba(221,221,221,0.2)] h-[44px] left-[20px] rounded-bl-[24px] rounded-br-[24px] top-[325px] w-[270px]" />
      <div className="absolute bg-[#eee] h-px left-[20px] top-[324px] w-[238px]" />
      <Group20 />
      <Group26 />
      <HAiLogo />
      <Frame4 />
    </div>
  );
}