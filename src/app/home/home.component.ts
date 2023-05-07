import { Component, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

import { Course, sortCoursesBySeqNo } from "../model/course";
import { CoursesService } from "../services/courses.service";

@Component({
  selector: "home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
})
export class HomeComponent implements OnInit {
  beginnerCourses$: Observable<Course[]>;
  advancedCourses$: Observable<Course[]>;

  constructor(private coursesService: CoursesService) {}

  ngOnInit() {
    this.reloadCourses();
  }

  reloadCourses() {
    const courses$ = this.coursesService
      .loadAllCourses()
      .pipe(map((courses) => courses.sort(sortCoursesBySeqNo)));

    this.beginnerCourses$ = courses$.pipe(
      map((course) => course.filter((course) => course.category === "BEGINNER"))
    );

    this.advancedCourses$ = courses$.pipe(
      map((course) => course.filter((course) => course.category === "ADVANCED"))
    );
  }
}
