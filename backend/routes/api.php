<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\{
    AuthController,
    CourseController,
    LessonController,
    NotificationController,
    SubjectController,
    BadgeController,
    QuizController,
    ProfileController,
    LessonSummaryController,
    StudyAssistantController,
    StudySessionController,
    AdminController,
    //Admin Controllers
    Admin\UserController,
    Admin\AdminDashboardController,
    Admin\AdminCourseController,
    Admin\AdminCategoryController,
    Admin\AdminNotificationController,
    //Api
    Api\DashboardController,
    Api\StatsChartController,
};

/*
|--------------------------------------------------------------------------
| AUTH (PUBLIC)
|--------------------------------------------------------------------------
*/
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/forgot-password', [AuthController::class, 'forgot']);
Route::post('/verify-code', [AuthController::class, 'verifyCode']);
Route::post('/reset-password', [AuthController::class, 'reset']);

Route::get('/auth/{provider}/redirect', [AuthController::class, 'socialRedirect']);
Route::get('/auth/{provider}/callback', [AuthController::class, 'socialCallback']);

/*
|--------------------------------------------------------------------------
| ADMIN-ONLY ROUTES
|--------------------------------------------------------------------------
*/
Route::prefix('admin')
    ->middleware(['auth:sanctum', 'admin'])
    ->group(function () {

        // Dashboard
        Route::get('/dashboard', [AdminDashboardController::class, 'index']);

        // Courses
        Route::get('/courses', [AdminCourseController::class, 'index']);
        Route::post('/courses', [AdminCourseController::class, 'store']);
        Route::get('/courses/{id}', [AdminCourseController::class, 'show']);
        Route::put('/courses/{id}', [AdminCourseController::class, 'update']);
        Route::delete('/courses/{id}', [AdminCourseController::class, 'destroy']);
        Route::patch('/courses/{id}/toggle', [AdminCourseController::class, 'toggle']);

        // Users
        Route::get('/users', [UserController::class, 'index']);
        Route::get('/users/{id}', [UserController::class, 'show']);
        Route::put('/users/{id}', [UserController::class, 'update']);
        Route::delete('/users/{id}', [UserController::class, 'destroy']);
        Route::patch('/users/{id}/toggle-status', [UserController::class, 'toggleStatus']);

        // Subjects
        Route::get('/subjects', [SubjectController::class, 'index']);
        Route::post('/subjects', [SubjectController::class, 'store']);
        Route::get('/subjects/{id}', [SubjectController::class, 'show']);
        Route::put('/subjects/{id}', [SubjectController::class, 'update']);
        Route::delete('/subjects/{id}', [SubjectController::class, 'destroy']);

        // Categories
        Route::get('/categories',               [AdminCategoryController::class, 'index']);
        Route::post('/categories',              [AdminCategoryController::class, 'store']);
        Route::get('/categories/{id}',          [AdminCategoryController::class, 'show']);
        Route::put('/categories/{id}',          [AdminCategoryController::class, 'update']);
        Route::delete('/categories/{id}',       [AdminCategoryController::class, 'destroy']);
        Route::patch('/categories/{id}/toggle', [AdminCategoryController::class, 'toggle']);

        // Lessons
        Route::get('/lessons', [LessonController::class, 'index']);
        Route::post('/lessons', [LessonController::class, 'store']);
        Route::get('/lessons/stats', [LessonController::class, 'stats']);
        Route::post('/lessons/bulk-delete', [LessonController::class, 'bulkDelete']);
        Route::post('/lessons/reorder', [LessonController::class, 'reorder']);
        Route::get('/lessons/{id}', [LessonController::class, 'show']);
        Route::put('/lessons/{id}', [LessonController::class, 'update']);
        Route::delete('/lessons/{id}', [LessonController::class, 'destroy']);
        Route::patch('/lessons/{id}/toggle', [LessonController::class, 'toggle']);
        Route::get('/courses/{courseId}/lessons', [LessonController::class, 'getByCourse']);
        Route::get('/subjects/{subjectId}/lessons', [LessonController::class, 'getBySubject']);

        // Badges
        Route::get('/badges', [BadgeController::class, 'index']);
        Route::post('/badges', [BadgeController::class, 'store']);
        Route::get('/badges/{id}', [BadgeController::class, 'show']);
        Route::put('/badges/{id}', [BadgeController::class, 'update']);
        Route::delete('/badges/{id}', [BadgeController::class, 'destroy']);

        // Admin Notifications
        Route::get('/notifications', [AdminNotificationController::class, 'index']);
        Route::patch('/notifications/{id}/read', [AdminNotificationController::class, 'markAsRead']);
        Route::post('/notifications/read-all', [AdminNotificationController::class, 'markAllAsRead']);
        Route::delete('/notifications/{id}', [AdminNotificationController::class, 'destroy']);
    });

/*
|--------------------------------------------------------------------------
| PROTECTED ROUTES
|--------------------------------------------------------------------------
*/
Route::middleware('auth:sanctum')->group(function () {
    /*
    |--------------------------------------------------------------------------
    | AUTH
    |--------------------------------------------------------------------------
    */
    Route::post('/logout', [AuthController::class, 'logout']);

    /*
    |--------------------------------------------------------------------------
    | PROFILE
    |--------------------------------------------------------------------------
    */
    Route::get('/profile', [ProfileController::class, 'getProfile']);
    Route::put('/profile', [ProfileController::class, 'updateProfile']);

    Route::post('/profile/avatar', [ProfileController::class, 'uploadAvatar']);
    Route::delete('/profile/avatar', [ProfileController::class, 'deleteAvatar']);

    Route::get('/profile/stats', [ProfileController::class, 'getUserStats']);
    Route::get('/profile/full', [ProfileController::class, 'getProfileWithStats']);

    Route::get('/profiles/{username}', [ProfileController::class, 'getPublicProfile']);

    /*
    |--------------------------------------------------------------------------
    | COURSES
    |--------------------------------------------------------------------------
    */
    Route::get('/courses', [CourseController::class, 'index']);
    Route::apiResource('courses', CourseController::class);

    /*
    |--------------------------------------------------------------------------
    | SUBJECTS
    |--------------------------------------------------------------------------
    */
    Route::get('/subjects', [SubjectController::class, 'index']);

    /*
    |--------------------------------------------------------------------------
    | LESSONS
    |--------------------------------------------------------------------------
    */
    Route::get('/lessons', [LessonController::class, 'index']);

    /*
    |--------------------------------------------------------------------------
    | BADGES
    |--------------------------------------------------------------------------
    */
    Route::get('/badges', [BadgeController::class, 'index']);
    Route::get('/user/badges', [BadgeController::class, 'userBadges']);
    Route::post('/badges/{id}/assign', [BadgeController::class, 'awardBadge']);

    /*
    |--------------------------------------------------------------------------
    | QUIZZES
    |--------------------------------------------------------------------------
    */
    Route::get('/quizzes', [QuizController::class, 'index']);
    Route::get('/quizzes/{id}', [QuizController::class, 'show']);
    Route::get('/lessons/{lessonId}/quizzes', [QuizController::class, 'byLesson']);

    Route::post('/auto-quiz', [QuizController::class, 'generateAndStoreQuiz']);
    Route::post('/quizzes/{id}/submit', [QuizController::class, 'submitAttempt']);
    Route::get('/quizzes/{id}/attempts', [QuizController::class, 'userAttempts']);

    /*
    |--------------------------------------------------------------------------
    | NOTIFICATIONS (USER)
    |--------------------------------------------------------------------------
    */
    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::post('/notifications', [NotificationController::class, 'store']);
    Route::delete('/notifications/{id}', [NotificationController::class, 'destroy']);
    Route::match(['put', 'patch'], '/notifications/{id}/read', [NotificationController::class, 'markAsRead']);

    /*
    |--------------------------------------------------------------------------
    | DASHBOARD
    |--------------------------------------------------------------------------
    */
    Route::get('/dashboard/stats', [DashboardController::class, 'stats']);
    Route::get('/dashboard/activity', [DashboardController::class, 'recentActivity']);
    Route::get('/dashboard/stats-chart', [StatsChartController::class, 'index']);


    /*
    |--------------------------------------------------------------------------
    | AI SUMMARY
    |--------------------------------------------------------------------------
    */
    Route::prefix('ai/summary')->group(function () {
        Route::post('/lesson/{lessonId}', [LessonSummaryController::class, 'summarize']);
        Route::post('/content', [LessonSummaryController::class, 'summarizeContent']);
    });

    /*
    |--------------------------------------------------------------------------
    | AI ASSISTANT
    |--------------------------------------------------------------------------
    */
    Route::prefix('ai/assistant')->group(function () {
        Route::post('/chat', [StudyAssistantController::class, 'chat']);
        Route::get('/history', [StudyAssistantController::class, 'history']);
        Route::delete('/clear', [StudyAssistantController::class, 'clear']);
    });

    /*
    |--------------------------------------------------------------------------
    | STUDY SESSIONS
    |--------------------------------------------------------------------------
    */
    Route::prefix('study-sessions')->group(function () {
        Route::get('/', [StudySessionController::class, 'index']);
        Route::post('/start', [StudySessionController::class, 'start']);
        Route::post('/end', [StudySessionController::class, 'end']);
    });
});