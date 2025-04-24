export default function AboutPage() {
    return (
      <div className="min-h-screen bg-zinc-900 text-white p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* English Column */}
        <div>
          <h2 className="text-2xl font-bold mb-4">About the Project</h2>
          <p className="mb-4">
            This project is an ongoing effort to provide open-access, text-searchable content from Persian periodical press during the Pahlavi Era. 
            It is entirely self-funded and non-commercial, intended solely for scholarly use.
          </p>
          <p className="mb-4">
            As interest grows in Iran's modern history, especially in the Pahlavi period, these digitised periodicals offer a vast, underutilised archive 
            for rethinking, rewriting, and revising our understanding of the era.
          </p>
          <p className="mb-4">
            Currently, the only available title is the periodical <em>Iranshahr</em>. Additional titles will be added as the project progresses.
          </p>
        </div>
  
        {/* Persian Column */}
        <div dir="rtl" className="text-right">
          <h2 className="text-2xl font-bold mb-4">دربارهٔ پروژه</h2>
          <p className="mb-4">
            این پروژه تلاشی مداوم برای فراهم‌کردن دسترسی آزاد به محتوای قابل‌جستجوی نشریات دورهٔ پهلوی به زبان فارسی است. این پروژه کاملاً شخصی، بدون بودجه و غیرتجاری است و تنها با اهداف پژوهشی دنبال می‌شود.
          </p>
          <p className="mb-4">
            با توجه به علاقهٔ روزافزون به تاریخ معاصر ایران و به‌ویژه دورهٔ پهلوی، نشریات دیجیتال‌شده منابعی مغفول‌مانده برای بازاندیشی، بازنویسی و بازسازی تاریخ این دوره فراهم می‌کنند.
          </p>
          <p className="mb-4">
            در حال حاضر تنها نشریهٔ <em>ایرانشهر</em> در دسترس است. در آینده نشریات بیشتری به پروژه افزوده خواهد شد.
          </p>
        </div>
      </div>
    );
  }
  