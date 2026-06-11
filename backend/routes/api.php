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
    SettingsController,
    ProfileController,
    LessonSummaryController,
    StudyAssistantController,
    Api\DashboardController,
    Api\StatsChartController
};

/*
|--------------------------------------------------------------------------
| TEST
|--------------------------------------------------------------------------
*/
Route::get('/test', fn () => response()->json([
    'message' => 'API WORKING'
]));

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
| PUBLIC HOME STATS
|--------------------------------------------------------------------------
*/
Route::get('/home-stats', fn () => response()->json([
    'users'    => \App\Models\User::count(),
    'sessions' => \App\Models\StudySession::count(),
]));

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
    Route::apiResource('courses', CourseController::class)
        ->except(['index', 'show']);

    /*
    |--------------------------------------------------------------------------
    | SUBJECTS
    |--------------------------------------------------------------------------
    */
    Route::get('/subjects', [SubjectController::class, 'index']);
    Route::apiResource('subjects', SubjectController::class)
        ->except(['index', 'show']);

    /*
    |--------------------------------------------------------------------------
    | LESSONS
    |--------------------------------------------------------------------------
    */
    Route::get('/lessons', [LessonController::class, 'index']);
    Route::apiResource('lessons', LessonController::class)
        ->except(['index', 'show']);

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
    | NOTIFICATIONS
    |--------------------------------------------------------------------------
    */
    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::post('/notifications', [NotificationController::class, 'store']);
    Route::delete('/notifications/{id}', [NotificationController::class, 'destroy']);

    Route::match(
        ['put', 'patch'],
        '/notifications/{id}/read',
        [NotificationController::class, 'markAsRead']
    );

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
    | SETTINGS
    |--------------------------------------------------------------------------
    */
    Route::prefix('settings')->group(function () {

        Route::get('/preferences', [SettingsController::class, 'getPreferences']);
        Route::put('/preferences', [SettingsController::class, 'updatePreferences']);

        Route::get('/security', [SettingsController::class, 'getSecuritySettings']);
        Route::post('/change-password', [SettingsController::class, 'changePassword']);

        Route::get('/account', [SettingsController::class, 'getAccountSummary']);
        Route::put('/account', [SettingsController::class, 'updateAccountSettings']);
        Route::delete('/account', [SettingsController::class, 'deleteAccount']);
    });

    /*
    |--------------------------------------------------------------------------
    | AI SUMMARY
    |--------------------------------------------------------------------------
    */
    Route::prefix('ai/summary')->group(function () {

        Route::post(
            '/lesson/{lessonId}',
            [LessonSummaryController::class, 'summarize']
        );

        Route::post(
            '/content',
            [LessonSummaryController::class, 'summarizeContent']
        );
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
});