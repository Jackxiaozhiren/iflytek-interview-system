import{_ as ue,S as pe,h as S,r as V,a2 as ce,o as U,i as u,j as me,k as ve,n as a,p as t,w as l,ap as r,N as g,a7 as fe,M as m,G as q,a5 as M,O as ge,a9 as _e,ag as be,z as b,v as N,ai as xe,as as ye,at as h}from"./index-b6a2842e.js";const he={class:"batch-interview-setup"},we={class:"page-header"},ke={class:"header-content"},Ce={class:"header-left"},Ve={class:"header-actions"},$e={class:"setup-content"},Ie={class:"setup-panel"},Be={class:"card-header"},Te={class:"card-header"},De={class:"header-actions"},Se={class:"candidates-section"},Ue={class:"candidates-stats"},qe={class:"stat-item"},Me={class:"stat-number"},Ne={class:"stat-item"},ze={class:"stat-number"},Ae={class:"stat-item"},Ee={class:"stat-number"},Fe={class:"preview-panel"},Pe={class:"card-header"},Re={class:"batch-preview"},je={class:"preview-item"},He={class:"preview-item"},Le={class:"preview-item"},Oe={class:"preview-item"},Ye={class:"preview-item"},Ge={class:"preview-item"},We={class:"card-header"},Je={class:"quick-actions"},Ke={__name:"BatchInterviewSetup",setup(Qe){const w=pe(),z=ye,d=S({batchName:"",position:"",domain:"",duration:60,interviewDate:[],description:""}),A={batchName:[{required:!0,message:"请输入批次名称",trigger:"blur"}],position:[{required:!0,message:"请选择面试职位",trigger:"change"}],domain:[{required:!0,message:"请选择技术领域",trigger:"change"}],duration:[{required:!0,message:"请选择面试时长",trigger:"change"}],interviewDate:[{required:!0,message:"请选择面试日期",trigger:"change"}]},_=V([{name:"张三",email:"zhangsan@example.com",phone:"13800138001",experience:"3-5年",status:"confirmed"},{name:"李四",email:"lisi@example.com",phone:"13800138002",experience:"1-3年",status:"pending"}]),v=S({name:"",email:"",phone:"",experience:""}),$=V(!1),y=V(!1),I=V(),E=ce(()=>{const s=_.value.length,e=d.duration||60,n=s*e,i=Math.floor(n/60),p=n%60;return i>0?`${i}小时${p}分钟`:`${p}分钟`}),F=()=>{w.go(-1)},P=()=>{w.push("/enterprise-reports")},R=async()=>{try{r.info("正在进行AI智能分析...");const s={interviews:_.value.map(n=>({id:`interview_${Date.now()}_${Math.random().toString(36).substring(2,9)}`,candidateName:n.name,candidateEmail:n.email,position:d.position,domain:d.domain,duration:d.duration,experience:n.experience})),analysisDepth:"comprehensive",reportingFormat:"detailed"},e=await z.processBatchInterviews(s);r.success(`AI分析完成！处理了${e.processedCount}个候选人，成功率${(e.successRate*100).toFixed(1)}%`),console.log("🤖 AI批量分析结果:",e)}catch(s){console.error("❌ AI分析失败:",s),r.error("AI分析暂时不可用，请稍后重试")}};U(async()=>{try{console.log("✅ iFlytek Spark服务已就绪")}catch(s){console.error("❌ iFlytek Spark服务初始化失败:",s)}});const j=s=>({frontend:"前端工程师",backend:"后端工程师",algorithm:"算法工程师",product:"产品经理","ui-designer":"UI设计师"})[s]||"未设置",B=s=>({ai:"AI技术",bigdata:"大数据",iot:"IoT物联网"})[s]||"未设置",H=()=>{r.success("草稿已保存")},L=async()=>{if(I.value)try{if(await I.value.validate(),_.value.length===0){r.warning("请至少添加一个候选人");return}$.value=!0,await new Promise(s=>setTimeout(s,2e3)),r.success("批量面试创建成功！"),w.push("/enterprise")}catch(s){console.error("表单验证失败:",s)}finally{$.value=!1}},O=()=>{y.value=!0},Y=()=>{if(!v.name||!v.email){r.warning("请填写必要信息");return}_.value.push({...v,status:"pending"}),Object.keys(v).forEach(s=>{v[s]=""}),y.value=!1,r.success("候选人添加成功")},G=s=>{r.info("编辑候选人功能开发中...")},W=s=>{h.confirm("确定要删除这个候选人吗？","确认删除",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then(()=>{_.value.splice(s,1),r.success("删除成功")}).catch(()=>{})},J=()=>{r.info("批量导入功能开发中...")},K=()=>{h.confirm("选择面试模板将自动填充相关配置，是否继续？","使用面试模板",{confirmButtonText:"确定",cancelButtonText:"取消",type:"info"}).then(()=>{Z()}).catch(()=>{})},Q=()=>{if(!batchName.value.trim()){r.warning("请先填写批次名称");return}if(selectedCandidates.value.length===0){r.warning("请先选择候选人");return}ee()},X=()=>{if(!batchName.value.trim()){r.warning("请先填写批次名称");return}if(selectedCandidates.value.length===0){r.warning("请先选择候选人");return}te()},Z=()=>{const s=[{id:1,name:"AI工程师标准模板",description:"适用于AI算法、机器学习相关职位",duration:60,domain:"ai",questions:15},{id:2,name:"大数据工程师模板",description:"适用于大数据开发、数据分析职位",duration:45,domain:"bigdata",questions:12},{id:3,name:"物联网工程师模板",description:"适用于IoT开发、嵌入式系统职位",duration:50,domain:"iot",questions:10}],e=s.map(n=>`<div style="padding: 12px; border: 1px solid #e4e7ed; border-radius: 6px; margin-bottom: 8px; cursor: pointer;" onclick="selectTemplate(${n.id})">
      <h4 style="margin: 0 0 8px 0; color: #1890ff;">${n.name}</h4>
      <p style="margin: 0 0 8px 0; color: #666; font-size: 14px;">${n.description}</p>
      <div style="font-size: 12px; color: #999;">
        <span>时长: ${n.duration}分钟</span> |
        <span>题目: ${n.questions}道</span> |
        <span>领域: ${B(n.domain)}</span>
      </div>
    </div>`).join("");h({title:"选择面试模板",message:`<div style="max-height: 400px; overflow-y: auto;">${e}</div>`,showCancelButton:!0,confirmButtonText:"自定义模板",cancelButtonText:"取消",dangerouslyUseHTMLString:!0,customClass:"template-selection-dialog"}).then(()=>{r.info("自定义模板功能开发中，敬请期待...")}).catch(()=>{}),window.selectTemplate=n=>{const i=s.find(p=>p.id===n);if(i){interviewDuration.value=i.duration,selectedDomain.value=i.domain,r.success(`已应用模板：${i.name}`);const p=document.querySelector(".template-selection-dialog");if(p){const f=p.querySelector(".el-message-box__close");f&&f.click()}}}},ee=()=>{const s=`
    <div style="font-family: 'Microsoft YaHei', sans-serif;">
      <div style="margin-bottom: 20px; padding: 16px; background: #f0f7ff; border-radius: 8px;">
        <h3 style="margin: 0 0 12px 0; color: #1890ff;">批次预览</h3>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; font-size: 14px;">
          <div><strong>批次名称:</strong> ${batchName.value}</div>
          <div><strong>面试职位:</strong> ${selectedPosition.value||"未设置"}</div>
          <div><strong>技术领域:</strong> ${B(selectedDomain.value)}</div>
          <div><strong>面试时长:</strong> ${interviewDuration.value}分钟</div>
          <div><strong>候选人数:</strong> ${selectedCandidates.value.length}人</div>
          <div><strong>预计时间:</strong> ${Math.ceil(selectedCandidates.value.length*interviewDuration.value/60)}小时</div>
        </div>
      </div>

      <div style="margin-bottom: 20px;">
        <h4 style="margin: 0 0 12px 0; color: #333;">候选人列表</h4>
        <div style="max-height: 200px; overflow-y: auto; border: 1px solid #e4e7ed; border-radius: 6px;">
          ${selectedCandidates.value.map((e,n)=>`
            <div style="padding: 8px 12px; border-bottom: 1px solid #f0f0f0; display: flex; justify-content: space-between;">
              <span>${e.name}</span>
              <span style="color: #666; font-size: 12px;">${e.experience} | ${e.phone}</span>
            </div>
          `).join("")}
        </div>
      </div>

      <div style="padding: 12px; background: #fff7e6; border-radius: 6px; border-left: 4px solid #fa8c16;">
        <strong style="color: #fa8c16;">注意事项：</strong>
        <ul style="margin: 8px 0 0 0; padding-left: 20px; font-size: 14px;">
          <li>请确保所有候选人信息准确无误</li>
          <li>面试开始前会发送通知邮件</li>
          <li>建议提前15分钟进入面试间</li>
        </ul>
      </div>
    </div>
  `;h({title:"批次预览",message:s,showCancelButton:!0,confirmButtonText:"确认创建",cancelButtonText:"返回修改",dangerouslyUseHTMLString:!0,customClass:"preview-dialog"}).then(()=>{r.success("批次创建成功！"),w.push("/position-management")}).catch(()=>{})},te=()=>{const s=`
    <div style="font-family: 'Microsoft YaHei', sans-serif;">
      <div style="margin-bottom: 20px;">
        <h4 style="margin: 0 0 12px 0;">时间安排设置</h4>
        <div style="display: grid; gap: 16px;">
          <div>
            <label style="display: block; margin-bottom: 8px; font-weight: 600;">面试开始时间</label>
            <input type="datetime-local" id="startTime" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;" />
          </div>
          <div>
            <label style="display: block; margin-bottom: 8px; font-weight: 600;">时间间隔</label>
            <select id="timeInterval" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
              <option value="30">30分钟</option>
              <option value="45">45分钟</option>
              <option value="60" selected>60分钟</option>
              <option value="90">90分钟</option>
            </select>
          </div>
          <div>
            <label style="display: block; margin-bottom: 8px; font-weight: 600;">工作日设置</label>
            <div style="display: flex; gap: 8px; flex-wrap: wrap;">
              <label style="display: flex; align-items: center; gap: 4px;">
                <input type="checkbox" checked /> 周一
              </label>
              <label style="display: flex; align-items: center; gap: 4px;">
                <input type="checkbox" checked /> 周二
              </label>
              <label style="display: flex; align-items: center; gap: 4px;">
                <input type="checkbox" checked /> 周三
              </label>
              <label style="display: flex; align-items: center; gap: 4px;">
                <input type="checkbox" checked /> 周四
              </label>
              <label style="display: flex; align-items: center; gap: 4px;">
                <input type="checkbox" checked /> 周五
              </label>
              <label style="display: flex; align-items: center; gap: 4px;">
                <input type="checkbox" /> 周六
              </label>
              <label style="display: flex; align-items: center; gap: 4px;">
                <input type="checkbox" /> 周日
              </label>
            </div>
          </div>
        </div>
      </div>

      <div style="padding: 12px; background: #f0f7ff; border-radius: 6px; border-left: 4px solid #1890ff;">
        <strong style="color: #1890ff;">智能建议：</strong>
        <p style="margin: 8px 0 0 0; font-size: 14px;">
          根据候选人数量(${selectedCandidates.value.length}人)和面试时长(${interviewDuration.value}分钟)，
          建议安排${Math.ceil(selectedCandidates.value.length/8)}天完成所有面试。
        </p>
      </div>
    </div>
  `;h({title:"时间安排",message:s,showCancelButton:!0,confirmButtonText:"生成时间表",cancelButtonText:"取消",dangerouslyUseHTMLString:!0,customClass:"schedule-dialog"}).then(()=>{var i,p;const e=(i=document.getElementById("startTime"))==null?void 0:i.value,n=(p=document.getElementById("timeInterval"))==null?void 0:p.value;if(!e){r.warning("请选择开始时间");return}r.success(`时间安排已生成！从 ${e} 开始，每 ${n} 分钟安排一场面试`)}).catch(()=>{})};return U(()=>{console.log("批量面试设置页面已加载")}),(s,e)=>{const n=u("el-icon"),i=u("el-button"),p=u("el-input"),f=u("el-form-item"),c=u("el-option"),k=u("el-select"),le=u("el-date-picker"),T=u("el-form"),C=u("el-card"),ae=u("CirclePlus"),x=u("el-table-column"),ne=u("el-tag"),oe=u("el-table"),D=u("el-col"),se=u("Promotion"),ie=u("el-row"),de=u("el-dialog");return me(),ve("div",he,[a("div",we,[a("div",ke,[a("div",Ce,[t(i,{onClick:F,link:"",class:"back-btn"},{default:l(()=>[t(n,null,{default:l(()=>[t(g(fe))]),_:1}),e[12]||(e[12]=m(" 返回 "))]),_:1,__:[12]}),e[13]||(e[13]=a("div",{class:"page-title"},[a("h1",null,"批量创建面试"),a("p",null,"高效管理大规模招聘需求，一键创建多场面试")],-1))]),a("div",Ve,[t(i,{onClick:P,type:"info"},{default:l(()=>[t(n,null,{default:l(()=>[t(g(q))]),_:1}),e[14]||(e[14]=m(" 查看报表 "))]),_:1,__:[14]}),t(i,{onClick:R,type:"warning"},{default:l(()=>[t(n,null,{default:l(()=>[t(g(M))]),_:1}),e[15]||(e[15]=m(" AI智能分析 "))]),_:1,__:[15]}),t(i,{onClick:H},{default:l(()=>e[16]||(e[16]=[m("保存草稿")])),_:1,__:[16]}),t(i,{type:"primary",onClick:L,loading:$.value},{default:l(()=>[t(n,null,{default:l(()=>[t(g(ge))]),_:1}),e[17]||(e[17]=m(" 创建批量面试 "))]),_:1,__:[17]},8,["loading"])])])]),a("div",$e,[t(ie,{gutter:24},{default:l(()=>[t(D,{span:16},{default:l(()=>[a("div",Ie,[t(C,{class:"setup-card"},{header:l(()=>[a("div",Be,[t(n,null,{default:l(()=>[t(g(M))]),_:1}),e[18]||(e[18]=a("span",null,"基本信息",-1))])]),default:l(()=>[t(T,{model:d,rules:A,ref_key:"batchFormRef",ref:I,"label-width":"120px"},{default:l(()=>[t(f,{label:"批次名称",prop:"batchName"},{default:l(()=>[t(p,{modelValue:d.batchName,"onUpdate:modelValue":e[0]||(e[0]=o=>d.batchName=o),placeholder:"请输入批次名称"},null,8,["modelValue"])]),_:1}),t(f,{label:"面试职位",prop:"position"},{default:l(()=>[t(k,{modelValue:d.position,"onUpdate:modelValue":e[1]||(e[1]=o=>d.position=o),placeholder:"选择面试职位",style:{width:"100%"}},{default:l(()=>[t(c,{label:"前端工程师",value:"frontend"}),t(c,{label:"后端工程师",value:"backend"}),t(c,{label:"算法工程师",value:"algorithm"}),t(c,{label:"产品经理",value:"product"}),t(c,{label:"UI设计师",value:"ui-designer"})]),_:1},8,["modelValue"])]),_:1}),t(f,{label:"技术领域",prop:"domain"},{default:l(()=>[t(k,{modelValue:d.domain,"onUpdate:modelValue":e[2]||(e[2]=o=>d.domain=o),placeholder:"选择技术领域",style:{width:"100%"}},{default:l(()=>[t(c,{label:"AI技术",value:"ai"}),t(c,{label:"大数据",value:"bigdata"}),t(c,{label:"IoT物联网",value:"iot"})]),_:1},8,["modelValue"])]),_:1}),t(f,{label:"面试时长",prop:"duration"},{default:l(()=>[t(k,{modelValue:d.duration,"onUpdate:modelValue":e[3]||(e[3]=o=>d.duration=o),placeholder:"选择面试时长"},{default:l(()=>[t(c,{label:"30分钟",value:30}),t(c,{label:"45分钟",value:45}),t(c,{label:"60分钟",value:60}),t(c,{label:"90分钟",value:90})]),_:1},8,["modelValue"])]),_:1}),t(f,{label:"面试日期",prop:"interviewDate"},{default:l(()=>[t(le,{modelValue:d.interviewDate,"onUpdate:modelValue":e[4]||(e[4]=o=>d.interviewDate=o),type:"daterange","range-separator":"至","start-placeholder":"开始日期","end-placeholder":"结束日期",style:{width:"100%"}},null,8,["modelValue"])]),_:1}),t(f,{label:"描述信息"},{default:l(()=>[t(p,{modelValue:d.description,"onUpdate:modelValue":e[5]||(e[5]=o=>d.description=o),type:"textarea",rows:3,placeholder:"请输入批次描述信息"},null,8,["modelValue"])]),_:1})]),_:1},8,["model"])]),_:1}),t(C,{class:"setup-card"},{header:l(()=>[a("div",Te,[t(n,null,{default:l(()=>[t(g(_e))]),_:1}),e[21]||(e[21]=a("span",null,"候选人管理",-1)),a("div",De,[t(i,{size:"small",onClick:J},{default:l(()=>[t(n,null,{default:l(()=>[t(g(be))]),_:1}),e[19]||(e[19]=m(" 批量导入 "))]),_:1,__:[19]}),t(i,{size:"small",type:"primary",onClick:O},{default:l(()=>[t(n,null,{default:l(()=>[t(ae)]),_:1}),e[20]||(e[20]=m(" 添加候选人 "))]),_:1,__:[20]})])])]),default:l(()=>[a("div",Se,[a("div",Ue,[a("div",qe,[a("span",Me,b(_.value.length),1),e[22]||(e[22]=a("span",{class:"stat-label"},"总候选人",-1))]),a("div",Ne,[a("span",ze,b(_.value.filter(o=>o.status==="confirmed").length),1),e[23]||(e[23]=a("span",{class:"stat-label"},"已确认",-1))]),a("div",Ae,[a("span",Ee,b(_.value.filter(o=>o.status==="pending").length),1),e[24]||(e[24]=a("span",{class:"stat-label"},"待确认",-1))])]),t(oe,{data:_.value,style:{width:"100%"},"max-height":"300"},{default:l(()=>[t(x,{prop:"name",label:"姓名",width:"120"}),t(x,{prop:"email",label:"邮箱",width:"200"}),t(x,{prop:"phone",label:"电话",width:"130"}),t(x,{prop:"experience",label:"经验",width:"80"}),t(x,{prop:"status",label:"状态",width:"100"},{default:l(o=>[t(ne,{type:o.row.status==="confirmed"?"success":"warning"},{default:l(()=>[m(b(o.row.status==="confirmed"?"已确认":"待确认"),1)]),_:2},1032,["type"])]),_:1}),t(x,{label:"操作",width:"120"},{default:l(o=>[t(i,{size:"small",onClick:re=>G(o.row)},{default:l(()=>e[25]||(e[25]=[m("编辑")])),_:2,__:[25]},1032,["onClick"]),t(i,{size:"small",type:"danger",onClick:re=>W(o.$index)},{default:l(()=>e[26]||(e[26]=[m("删除")])),_:2,__:[26]},1032,["onClick"])]),_:1})]),_:1},8,["data"])])]),_:1})])]),_:1}),t(D,{span:8},{default:l(()=>[a("div",Fe,[t(C,{class:"preview-card"},{header:l(()=>[a("div",Pe,[t(n,null,{default:l(()=>[t(g(N))]),_:1}),e[27]||(e[27]=a("span",null,"批次预览",-1))])]),default:l(()=>[a("div",Re,[a("div",je,[e[28]||(e[28]=a("label",null,"批次名称：",-1)),a("span",null,b(d.batchName||"未设置"),1)]),a("div",He,[e[29]||(e[29]=a("label",null,"面试职位：",-1)),a("span",null,b(j(d.position)),1)]),a("div",Le,[e[30]||(e[30]=a("label",null,"技术领域：",-1)),a("span",null,b(B(d.domain)),1)]),a("div",Oe,[e[31]||(e[31]=a("label",null,"面试时长：",-1)),a("span",null,b(d.duration?d.duration+"分钟":"未设置"),1)]),a("div",Ye,[e[32]||(e[32]=a("label",null,"候选人数：",-1)),a("span",null,b(_.value.length)+"人",1)]),a("div",Ge,[e[33]||(e[33]=a("label",null,"预计时间：",-1)),a("span",null,b(E.value),1)])])]),_:1}),t(C,{class:"quick-actions-card"},{header:l(()=>[a("div",We,[t(n,null,{default:l(()=>[t(se)]),_:1}),e[34]||(e[34]=a("span",null,"快速操作",-1))])]),default:l(()=>[a("div",Je,[t(i,{class:"action-btn",onClick:K},{default:l(()=>[t(n,null,{default:l(()=>[t(g(q))]),_:1}),e[35]||(e[35]=m(" 使用模板 "))]),_:1,__:[35]}),t(i,{class:"action-btn",onClick:Q},{default:l(()=>[t(n,null,{default:l(()=>[t(g(N))]),_:1}),e[36]||(e[36]=m(" 预览面试 "))]),_:1,__:[36]}),t(i,{class:"action-btn",onClick:X},{default:l(()=>[t(n,null,{default:l(()=>[t(g(xe))]),_:1}),e[37]||(e[37]=m(" 安排时间 "))]),_:1,__:[37]})])]),_:1})])]),_:1})]),_:1})]),t(de,{modelValue:y.value,"onUpdate:modelValue":e[11]||(e[11]=o=>y.value=o),title:"添加候选人",width:"500px"},{footer:l(()=>[t(i,{onClick:e[10]||(e[10]=o=>y.value=!1)},{default:l(()=>e[38]||(e[38]=[m("取消")])),_:1,__:[38]}),t(i,{type:"primary",onClick:Y},{default:l(()=>e[39]||(e[39]=[m("确定")])),_:1,__:[39]})]),default:l(()=>[t(T,{model:v,"label-width":"80px"},{default:l(()=>[t(f,{label:"姓名",required:""},{default:l(()=>[t(p,{modelValue:v.name,"onUpdate:modelValue":e[6]||(e[6]=o=>v.name=o),placeholder:"请输入候选人姓名"},null,8,["modelValue"])]),_:1}),t(f,{label:"邮箱",required:""},{default:l(()=>[t(p,{modelValue:v.email,"onUpdate:modelValue":e[7]||(e[7]=o=>v.email=o),placeholder:"请输入邮箱地址"},null,8,["modelValue"])]),_:1}),t(f,{label:"电话"},{default:l(()=>[t(p,{modelValue:v.phone,"onUpdate:modelValue":e[8]||(e[8]=o=>v.phone=o),placeholder:"请输入联系电话"},null,8,["modelValue"])]),_:1}),t(f,{label:"工作经验"},{default:l(()=>[t(k,{modelValue:v.experience,"onUpdate:modelValue":e[9]||(e[9]=o=>v.experience=o),placeholder:"选择工作经验"},{default:l(()=>[t(c,{label:"应届生",value:"0-1年"}),t(c,{label:"1-3年",value:"1-3年"}),t(c,{label:"3-5年",value:"3-5年"}),t(c,{label:"5年以上",value:"5年以上"})]),_:1},8,["modelValue"])]),_:1})]),_:1},8,["model"])]),_:1},8,["modelValue"])])}}},Ze=ue(Ke,[["__scopeId","data-v-f8882215"]]);export{Ze as default};
