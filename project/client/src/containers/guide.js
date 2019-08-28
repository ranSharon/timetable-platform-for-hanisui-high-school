import React, { Component } from 'react';

class Guide extends Component {
    render() {
        return (
            <div style={{ "textAlign": "right" }}>
                <h3 className='mt-2'>ברוכים הבאים למערכת בניית מערכת שעות</h3>
                <h5>במהלך המדריך הבא נסביר מה השלבים הנכונים לבניית מערכת השעות תוך כדי הצגת דוגמאות להבנה טובה יותר.</h5>
                <p>לפני שנבצע את תהליך בניית המערכת צריך קודם להגדיר את כל נתוני בית הספר בצורה נכונה ובסדר נכון, לאחר שהגדרנו את כל נתוני בית הספר נתחיל עם תהליך הבנייה של המערכת.</p>
                <p>הערה חשובה לפני שמתחילים, סדר השלבים המתוארים בחלק זה הינם הצורה הנכונה להגדיר את נתוני המערכת ולכן מומלץ להגדיר את הנותנים בסדר השלבים המתואר.</p>
                <h5>שלבי הגדרת נתוני בית הספר בסדר ובצורה הנכונה:</h5>
                <ul>
                    <li>
                        נלחץ על לשונית "הגדרת נתונים ושיעורים".<br />
                        <p>כעת יפתח לך סרגל כלים משני שמציג את כל הנתונים שניתן להגדיר (שלד המערכת, שכבות וכיתות, חדרי לימוד, מקצועות מורים והגדרת שיעורים).</p>
                    </li>


                    <h6>שלב ראשון – הגדרת שלד המערכת:</h6>
                    <li>
                        נלחץ על לשונית "שלד המערכת"<br />
                        <p>במסך זה נצטרך להגדיר את שלד מערכת השעות של בית הספר באופן כללי. נבחר יום בשבוע ונגדיר לו שעת התחלה ושעת סיום.</p>
                        <p>בכל שלב במהלך הגדרת שלד המערכת ניתן לערוך המערכת או למחוק יום שהגדרנו.</p>
                        <ul>
                            הערות לשלב זה:
                            <li>אם כבר בנינו והגדרנו מערכת שעות (אפילו רק לכיתה אחת), שינויים בשלד המערכת לא ישפיעו על המערכת שהגדרנו, לכן חשוב להגדיר את שלד המערכת בתור התחלה בצורה המדויקת ביותר.</li>
                            <li>אם כן נצטרך לבצע שינוי בשלד המערכת לאחר שכבר התחלנו להגדיר את מערכת השעות, נצטרך תחילה למחוק את מערכת השעות שהגדרנו ואז שינויים על שלד המערכת ישפיעו על תצוגת מערכת השעות.</li>
                        </ul>
                    </li>
                    <br />

                    <h6>שלב שני – הגדרת שכבות וכיתות:</h6>
                    <li>
                        נלחץ על לשונית "שכבות וכיתות"<br />
                        <p>במסך זה נצטרך להגדיר את שכבות וכיתות בית הספר בית הספר. נבחר שכבה ונגדיר לה את מספר הכיתות שהיא מכילה.</p>
                        <p>בכל שלב במהלך הגדרת שכבות וכיתות ניתן לערוך המערכת או למחוק שכבה שהגדרנו.</p>
                        <ul>הערות לשלב זה:
                            <li>אם כבר בנינו והגדרנו מערכת שעות (אפילו רק לכיתה אחת), שינויים בשכבות וכיתות לא ישפיעו על המערכת שהגדרנו, לכן חשוב להגדיר את שכבות וכיתות בית הספר בתור התחלה בצורה המדויקת ביותר.</li>
                            <li>אם כן נצטרך לבצע שינוי בשכבות הכיתה לאחר שכבר התחלנו להגדיר את מערכת השעות, נצטרך תחילה למחוק את מערכת השעות שהגדרנו ואז שינויים שכבות וכיתות בית הספר ישפיעו על תצוגת מערכת השעות.</li>
                        </ul>
                    </li>
                    <br />

                    <h6>שלב שלישי – הגדרת חדרי לימוד:</h6>
                    <li>
                        נלחץ על לשונית " חדרי לימוד"<br />
                        <p>במסך זה נצטרך להגדיר את כל חדרי הלימוד בבית הספר.</p>
                        <p>בכל שלב במהלך הגדרת חדרי הלימוד ניתן לערוך המערכת או למחוק שכבה שהגדרנו.</p>
                        <ul>
                            הערות לשלב זה:
                            <li>אם כבר בנינו והגדרנו מערכת שעות (אפילו רק לכיתה אחת), שינויים בחדרי הלימוד לא ישפיעו על המערכת שהגדרנו, לכן חשוב להגדיר את חדרי הלימוד בבית הספר בתור התחלה בצורה המדויקת ביותר.</li>
                            <li>אם כן נצטרך לבצע שינוי בחדרי הלימוד לאחר שכבר התחלנו להגדיר את מערכת השעות, נצטרך תחילה למחוק את השיעורים שמשויכים לחדרי הלימוד שנרצה למחוק/לערוך ולאחר מכן נוכל להמשיך לבנות את מערכת השעות עם חדרי הלימוד החדשים.</li>
                        </ul>
                        <br />
                        <p>בנוסף, במסך זה ישנה אפשרות להגדיר מאפייני חדר שניתן לשייך לחדר לימוד (אפשרות זהו נועדה רק להקל על בניית המערכת בהמשך אך אינה חלק הכרחי מהגדרת נותני בית הספר, כמו כן אין צורך להגדיר לכל חדר לימוד מאפיין חלק זה נועד עבור חדרי לימוד שייעודים עבור מקצועות מסוימים).</p>
                        <p>דוגמא להגדרת מאפיין, חדר לימוד שאנו יודעים מראש שצריך שיהיו בו מחשבים:</p>
                        <ul>
                            <li>
                                נגדיר מאפיין שנקרא "מחשבים".
                            <p>**תמונה של הגדרת מאפיין מחשבים**</p>
                            </li>
                            <li>
                                נגדיר כעת את חדר הלימוד "חדר מחשבים" ונשייך לו את המאפיין "מחשבים".
                            <p>**תמונה של שלב זה**</p>
                            </li>
                        </ul>
                        <p>בכל שלב ניתן למחוק מאפיינים שהגדרנו.</p>

                        <ul>
                            הערות לשלב הגדרת מאפייני חדר:
                            <li>לאחר הגדרת מאפייני חדר, נוכל לראות במסך הבא של הגדרת מקצועות שיש אופציה לשייך למקצוע את המאפיינים שהגדרנו ובשלב בניית מערכת השעות ברגע שנצטרך להתאים לשיעור מסוים חדר לימוד המערכת תדע להציג לנו את חדרי הלימוד המתאמים בלבד למקצוע מסוים.</li>
                            <li>אם כבר הגדרנו מקצועות או חדרי לימוד עם מאפיינים, מחיקת מאפיינים לא תשפיע על חדרי הלימוד או המקצועות שכבר הגודרו לאותם מאפיינים.</li>
                            <li>אם כן נרצה למחוק מאפיינים מסוימים שכבר משויכים לחדרי לימוד או מקצועות, נצטרך תחילה למחוק את אותם חדרי לימוד ומקצועות ולאחר מכן נוכל למחוק את המאפיינים שרצינו.</li>
                        </ul>
                    </li>
                    <br />

                    <h6>שלב רביעי – הגדרת מקצועות:</h6>
                    <li>
                        נלחץ על לשונית "מקצועות"<br />
                        <p>במסך זה נצטרך להגדיר את כל המקצועות הנלמדים בבית הספר.</p>
                        <ul>
                            <li>
                                <p>נזין את שם המקצוע.</p>
                            </li>
                            <li>
                                <p>נבחר באיזה כיתות הוא נלמד.</p>
                            </li>
                            <li>
                                <p>נסמן אם המקצוע נלמד לבגרות, אם כן נצטרך להגדיר את הגמול עבור המקצוע.</p>
                            </li>
                            <li>
                                <p>נצטרך לבחור האם המקצוע מערבב שכבה (מערבב שכבה הכוונה, מקצוע שלמשל מחולק להקבצות או נלמד כמגמה). אם נבחר שכן נשאל האם הוא נלמד בהקבצות, אם נבחר שכן נצטרך לבחור לכמה הקבצות הוא מחולק.</p>
                                <ul>
                                    הערה לגבי בחירה שמקצוע שמערבב שכבה:
                                    <li>במקרה שנצטרך להגדיר מקצועות שמערבבים שכבה שאינם מחולקים להקבצות אך הם נלמדים בכל זאת באותה שעה נגדיר זאת בדרך הבאה. לדוגמא נדע שבשכבות ז' המקצועות מלאכה וכלכלת בית גם מערבבים שכבה וגם נלמדים במקביל, בהזנת שם השיעור נזין את המקצועות האלה כמקצוע אחד בשם "מלאכה, כלכלת בית". כעת נסמן שמקצוע זה מערבב שכבה וגם נלמד בהקבצות ושנצטרך להזין לכמה הקבצות נבחר את המספר 2 (כמספר המקצועות שנלמדים במקביל).</li>
                                </ul>
                            </li>
                            <br />
                            <li>
                                <p>נבחר מה המקצוע דורש (מאפיינים שהגדרנו בשלב הגדרת חדרי לימוד).</p>
                            </li>
                        </ul>
                        <p>בכל שלב במהלך הגדרת שכבות וכיתות ניתן לערוך או למחוק שכבה שהגדרנו.</p>
                        <ul>
                            הערות לשלב זה:
                            <li>אם כבר הגדרנו שיעורים שמשויכים למקצועות שנרצה למחוק או לערוך, מחיקת או עריכת מקצועות אלו במסך הגדרת מקצועות לא ישפיעו על שיעורים אלו. לכן חשוב להגדיר את מקצועות בית הספר בתור התחלה בצורה המדויקת ביותר כדי להימנע מכמה שפחות שינויים בשלבים מתקדמים בניית המערכת.</li>
                            <li>אם כן נצטרך לבצע שינוי במקצועות בית הספר לאחר שכבר שייכנו אותם לשיעורים מסוימים, נצטרך תחילה למחוק את השיעורים שמשויכים לאותם מקצועות ולאחר מכן נסיר או נערוך מקצועות אלו ללא דאגה.</li>
                        </ul>
                    </li>
                    <br />

                    <h6>שלב חמישי – הגדרת מורים:</h6>
                    <li>
                        נלחץ על לשונית "מורים"<br />
                        <p>במסך זה נצטרך להגדיר את כל המורים המלמדים בבית הספר.</p>
                        <p>בכל שלב במהלך הגדרת שלד המערכת ניתן לערוך המערכת או למחוק יום שהגדרנו.</p>
                        <ul>
                            הערות לשלב זה:
                            <li>אם כבר בנינו והגדרנו מערכת שעות (אפילו רק לכיתה אחת), שינויים בשלד המערכת לא ישפיעו על המערכת שהגדרנו, לכן חשוב להגדיר את שלד המערכת בתור התחלה בצורה המדויקת ביותר.</li>
                            <li>אם כן נצטרך לבצע שינוי בשלד המערכת לאחר שכבר התחלנו להגדיר את מערכת השעות, נצטרך תחילה למחוק את מערכת השעות שהגדרנו ואז שינויים על שלד המערכת ישפיעו על תצוגת מערכת השעות.</li>
                        </ul>
                    </li>
                    <br />
                </ul>
            </div>
        );
    }
}

export default Guide;
