import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, of, throwError } from "rxjs";
import { Course, sortCoursesBySeqNo } from "../model/course";
import { catchError, map, share, shareReplay, tap } from "rxjs/operators";
import { HttpClient } from "@angular/common/http";
import { LoadingService } from "../loading/loading.service";
import { MessagesService } from "../messages/messages.service";

@Injectable({
  providedIn: "root",
})
export class CoursesStore {
  private subject = new BehaviorSubject<Course[]>([]);
  courses$: Observable<Course[]> = this.subject.asObservable();

  constructor(
    private http: HttpClient,
    private loading: LoadingService,
    private messages: MessagesService
  ) {
    this.loadAllCourses();
  }

  private loadAllCourses() {
    const loadCourses$ = this.http.get<Course[]>("/api/courses").pipe(
      map((response) => response["payload"]),
      catchError((err) => {
        const messages = "Could not load courses";
        this.messages.showErrors(messages);
        console.log(messages, err);
        return throwError(err);
      }),
      tap((courses) => this.subject.next(courses))
    );

    this.loading.showLoaderUntilCompleted(loadCourses$).subscribe();
  }

  saveCourse(courseId: string, changes: Partial<Course>) {
    // get the current value of courses subject
    const courses = this.subject.getValue();
    // find the index of the course with the specified course id
    const index = courses.findIndex((course) => course.id === courseId);
    // update the course with the specified course id, add the changes
    const updatedCourse: Course = {
      ...courses[index],
      ...changes,
    };
    // create a copy of the courses array, passing in 0 allows us to copy the entire array
    const updatedCourses: Course[] = courses.slice(0);
    // update the course at the specified index
    updatedCourses[index] = updatedCourse;
    // emit the updated courses array
    this.subject.next(updatedCourses);

    // server side save, use shareReplay to prevent multiple http calls
    return this.http.put(`/api/courses/${courseId}`, changes).pipe(
      catchError((err) => {
        const messages = "Could not save course";
        this.messages.showErrors(messages);
        console.log(messages, err);
        return throwError(err);
      }),
      shareReplay()
    );
  }

  filterByCategory(category: string): Observable<Course[]> {
    return this.courses$.pipe(
      map((courses) =>
        courses
          .filter((course) => course.category === category)
          .sort(sortCoursesBySeqNo)
      )
    );
  }
}
