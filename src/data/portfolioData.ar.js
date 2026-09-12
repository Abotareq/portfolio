/**
 * Arabic overrides for portfolioData.js. Only translatable prose is here —
 * names, links, technologies and dates are shared with the English source.
 * Keyed by the same ids used in portfolioData.js.
 */
export const personalAr = {
  name: 'أحمد طارق محمد',
  shortName: 'أحمد طارق',
  title: 'مطوّر Full Stack',
  location: 'الجيزة، مصر',
  degreeLine: 'بكالوريوس علوم الحاسب',
  summary:
    'مطوّر Full-Stack أعمل بشكل أساسي بـ .NET وReact، مع خبرة عملية في الـ Backend والـ Frontend عبر SQL Server وEF Core وReact وAngular. ساهمت في معمارية وBackend منصة Tawreed، وهي منصة شراء جماعي B2B للشركات الصغيرة، باستخدام Clean Architecture وASP.NET Core ومصادقة JWT والتحكم بالوصول حسب الدور. أعمل أيضاً عبر MERN Stack وأطلقت منصة تجارة إلكترونية عربية تدعم RTL بـ React وNode. مرتاح في العمل عبر كامل الـ Stack من تصميم قاعدة البيانات حتى الواجهة.',
  intro:
    'أبني تطبيقات ويب بجودة إنتاجية عبر .NET وReact — من Backends بـ Clean Architecture على ASP.NET Core وSQL Server إلى واجهات متجاوبة ومصقولة. أمتلك كامل الـ Stack من تصميم قاعدة البيانات حتى الواجهة.',
  languages: [
    { name: 'العربية', level: 'اللغة الأم' },
    { name: 'الإنجليزية', level: 'جيد جداً' },
  ],
  extras: [
    { label: 'الجنسية', value: 'مصري' },
    { label: 'الخدمة العسكرية', value: 'معفى' },
  ],
}

export const statsAr = [
  { label: 'مشاريع منجزة', note: '3 في السيرة الذاتية + 2 على GitHub' },
  { label: 'أعضاء فريق قُدتهم', note: 'Herfy — قائد فريق معيّن رسمياً' },
  { label: 'برامج تدريب هندسي', note: 'Next Technology · ITI' },
  { label: 'مستودعات عامة', note: 'github.com/Abotareq' },
]

export const projectsAr = {
  tawreed: {
    tagline: 'منصة شراء جماعي للشركات الصغيرة',
    role: 'مساهم – المعمارية وتطوير الـ Backend',
    type: 'منصة B2B',
    description: 'منصة B2B تربط مشتري الشركات الصغيرة بالموردين للطلب بالجملة. تجمّع الشركات الصغيرة طلباتها للوصول إلى أسعار الموردين المخصصة عادةً للمشترين بالجملة.',
    features: [
      'المساهمة في معمارية النظام وتصميم الـ Backend لمنصة الشراء الجماعي',
      'تنفيذ الـ Backend بـ ASP.NET Core Web API وC# وEF Core وSQL Server وASP.NET Identity وفق مبادئ Clean Architecture',
      'منطق المصادقة والصلاحيات حسب الدور باستخدام JWT وFluentValidation',
      'تطبيق Repository Pattern وService Layer وDependency Injection وDTO Mapping في الوحدات الموكلة',
    ],
  },
  herfy: {
    tagline: 'منصة تجارة إلكترونية عربية للحرف اليدوية تدعم RTL',
    role: 'قائد فريق – فريق من 4 أشخاص',
    type: 'تجارة إلكترونية · MERN',
    description: 'منصة تجارة إلكترونية عربية متكاملة تدعم RTL بسوق متعدد البائعين: يدير البائعون متاجرهم بينما يتصفح العملاء المنتجات اليدوية ويقيّمونها ويطلبونها.',
    features: [
      'قيادة فريق من 4 أشخاص كقائد معيّن رسمياً: توزيع المهام، مراجعة الـ Pull Requests، واتخاذ قرارات المعمارية',
      'صلاحيات حسب الدور، مصادقة JWT، إدارة السلة، مسارات الدفع، وإدارة الطلبات',
      'إدارة حالة التطبيق عبر Redux Toolkit وContext API وTanStack Query',
      'متاجر متعددة البائعين، متغيرات المنتجات، التقييمات، الكوبونات، الدفع عبر Stripe ورفع الصور عبر Cloudinary',
    ],
  },
  'helpdesk-lite': {
    tagline: 'منصة تذاكر دعم داخلية',
    role: 'فردي – Full-stack (TypeScript monorepo)',
    type: 'أداة داخلية · MERN',
    description: 'مساحة عمل خفيفة لتذاكر الدعم الداخلي: يقدّم الموظفون الطلبات، ويتولاها فريق الدعم، ويرى المديرون ما هو مفتوح. مستودع واحد بـ npm workspaces يضم API بـ Express وMongoDB مع TypeScript وواجهة React 19 + Vite.',
    features: [
      'سير عمل بخمس حالات مع مسار لإعادة الفتح، ملكية فردية مع الاستلام وإعادة الإسناد، وسجل كامل لكل طلب',
      'ثلاثة أدوار (موظف، وكيل، مدير) مع حماية المسارات، قائمة انتظار للمدير، إحصائيات لوحة التحكم، وإدارة الحسابات',
      'Backend طبقي لا يستورد فيه الـ Domain مكتبة Mongoose؛ واجهات المستودعات هي نقطة الاستبدال لاختبارات Jest مع حدود تغطية مفروضة',
      'واجهة React من مكونات صغيرة مع TanStack Query وReact Router وTypeScript صارم؛ البناء يتحقق من الأنواع قبل التجميع',
    ],
  },
  'customer-service': {
    tagline: 'نظام Backend بـ DDD / Clean Architecture',
    role: 'فردي – Backend',
    type: 'Backend API · .NET',
    description: 'Backend لاستقبال طلبات دعم العملاء وتتبعها وحلّها، مبني على ASP.NET Core بـ Clean Architecture وDomain-Driven Design وCQRS عبر MediatR.',
    features: [
      'Clean Architecture مع DDD وCQRS (MediatR) تغطي تقديم الطلبات والإسناد وتغيير الحالة والمراسلة بين العملاء والوكلاء',
      'مصادقة JWT مع تدوير Refresh Token، تأكيد البريد، ومسارات نسيان/إعادة تعيين كلمة المرور عبر ASP.NET Identity',
      'تسليم الرسائل لحظياً عبر SignalR مع بث التحديثات لكل طلب إلى العملاء والوكلاء المتصلين',
      'صلاحيات حسب الدور وحسب المورد بحيث يرى العملاء والوكلاء والمديرون الطلبات المسموح بها فقط',
    ],
  },
  inventory: {
    tagline: 'API لإدارة مخزون المستودعات ومعالجة الطلبات',
    role: 'فردي – Backend',
    type: 'Backend API · .NET',
    description: 'Backend API لإدارة كتالوج المنتجات ومخزون متعدد المستودعات وطلبات العملاء، مع الحفاظ على دقة المخزون خلال دورة حياة الطلب وسجل تدقيق كامل.',
    features: [
      'نموذج حجز مخزون على مرحلتين (فعلي مقابل محجوز) مع دورة حياة الطلب Draft → Submitted → Processing → Completed',
      'تزامن تفاؤلي على المخزون والطلبات مع إنشاء طلبات Idempotent عبر مفاتيح يوفرها العميل',
      'سجل تدقيق على مستوى الحقول لكل Aggregate، مدفوع بأحداث الـ Domain عبر SaveChanges interceptor',
      'أربعة أدوار (مدير النظام، مشغّل المستودع، وكيل المبيعات، المدير) مع مصادقة JWT عبر ASP.NET Identity',
    ],
  },
}

export const experienceAr = {
  next: {
    title: 'متدرب مهندس برمجيات Full-Stack',
    company: 'Next for Technology Development',
    location: 'القاهرة، مصر',
    bullets: [
      'بناء ونشر مزايا Full-Stack من البداية للنهاية: ASP.NET Core Web APIs مدعومة بـ SQL Server وEF Core مع واجهات React',
      'تنفيذ مصادقة JWT وصلاحيات حسب الدور عبر معمارية طبقية',
      'استخدام تفرعات Git وسير عمل Pull Requests ضمن فريق',
    ],
  },
  iti: {
    title: 'متدرب MEARN Stack',
    company: 'معهد تكنولوجيا المعلومات (ITI)',
    location: 'مصر',
    bullets: [
      'بناء تطبيقات Full-Stack على MERN: واجهات Express وNode، مخططات MongoDB، وواجهات React وAngular',
      'بناء ودمج RESTful APIs بين طبقتي الـ Frontend والـ Backend',
      'العمل ضمن فريق باستخدام Git وسبرنتات Agile',
    ],
  },
}

export const educationAr = {
  bsc: {
    degree: 'بكالوريوس علوم الحاسب',
    institution: 'جامعة غرينتش وجامعة أكتوبر للعلوم الحديثة والآداب (MSA)',
    location: 'مصر',
    details: ['برنامج معتمد مزدوجاً', 'التقدير: جيد'],
  },
}

export const certificationsAr = [{ placeholder: true, text: 'لا توجد شهادات مذكورة في السيرة الذاتية. أضفها في src/data/portfolioData.js → certifications.' }]
